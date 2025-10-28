package services

import (
	"fmt"
	"loan-microservice/internal/models"
	"loan-microservice/internal/repositories"
	"math"
	"time"

	"github.com/google/uuid"
)

type LoanService interface {
	ApplyLoan(userID, borrowerName string, amount float64, termMonths int, loanType string) (*models.Loan, error)
	GetAllLoans() ([]models.Loan, error)
	ApproveLoan(id uuid.UUID) error
	RejectLoan(id uuid.UUID, reason string) error
	GetUserLoans(userID string) ([]models.Loan, error)
	GetRepayments(loanID uuid.UUID) ([]models.Repayment, error)
	PayRepayment(repaymentID uuid.UUID, userID string) error
}

type loanService struct {
	loanRepo      repositories.LoanRepository
	repaymentRepo repositories.RepaymentRepository
}

func NewLoanService(loanRepo repositories.LoanRepository, repaymentRepo repositories.RepaymentRepository) LoanService {
	return &loanService{loanRepo, repaymentRepo}
}

var interestRates = map[string]float64{
	"home": 0.08,
	"car":  0.09,
	"gold": 0.07,
}

func (s *loanService) ApplyLoan(userID, borrowerName string, amount float64, termMonths int, loanType string) (*models.Loan, error) {
	loan := &models.Loan{
		UserID:       userID,
		BorrowerName: borrowerName,
		Amount:       amount,
		TermMonths:   termMonths,
		LoanType:     loanType,
		Status:       models.Pending,
		InterestRate: interestRates[loanType],
	}
	if loan.InterestRate == 0 {
		loan.InterestRate = 0.10 // Default 10%
	}
	err := s.loanRepo.Create(loan)
	return loan, err
}

func (s *loanService) GetAllLoans() ([]models.Loan, error) {
	return s.loanRepo.FindAll()
}

func (s *loanService) ApproveLoan(id uuid.UUID) error {
	loan, err := s.loanRepo.FindByID(id)
	if err != nil {
		return err
	}
	if loan.Status != models.Pending {
		return nil // Idempotent
	}

	now := time.Now()
	loan.Status = models.Approved
	loan.ApprovalDate = &now
	if loan.InterestRate == 0 {
		rate, ok := interestRates[loan.LoanType]
		if !ok {
			rate = 0.10 // Default 10%
		}
		loan.InterestRate = rate
	}
	err = s.loanRepo.Update(loan)
	if err != nil {
		return err
	}

	rate := loan.InterestRate
	interest := loan.Amount * rate * (float64(loan.TermMonths) / 12)
	total := loan.Amount + interest
	emi := total / float64(loan.TermMonths)

	for i := 1; i <= loan.TermMonths; i++ {
		dueDate := now.AddDate(0, i, 0)
		repayment := &models.Repayment{
			LoanID:  loan.ID,
			DueDate: dueDate,
			Amount:  math.Round(emi*100) / 100,
			Status:  models.RepayPending,
		}
		if err := s.repaymentRepo.Create(repayment); err != nil {
			return err
		}
	}
	return nil
}

func (s *loanService) RejectLoan(id uuid.UUID, reason string) error {
	loan, err := s.loanRepo.FindByID(id)
	if err != nil {
		return err
	}
	if loan.Status != models.Pending {
		return nil // Idempotent
	}
	loan.Status = models.Rejected
	loan.RejectionReason = &reason
	return s.loanRepo.Update(loan)
}

func (s *loanService) GetUserLoans(userID string) ([]models.Loan, error) {
	return s.loanRepo.FindByUserID(userID)
}

func (s *loanService) GetRepayments(loanID uuid.UUID) ([]models.Repayment, error) {
	return s.repaymentRepo.FindByLoanID(loanID)
}

func (s *loanService) PayRepayment(repaymentID uuid.UUID, userID string) error {
	repayment, err := s.repaymentRepo.FindByID(repaymentID)
	if err != nil {
		return fmt.Errorf("failed to find repayment: %w", err)
	}
	loan, err := s.loanRepo.FindByID(repayment.LoanID)
	if err != nil {
		return fmt.Errorf("failed to find loan: %w", err)
	}
	if loan.UserID != userID {
		return fmt.Errorf("unauthorized: user does not own this loan")
	}
	if repayment.Status == models.Paid {
		return fmt.Errorf("repayment already paid")
	}
	repayment.Status = models.Paid
	repayment.UpdatedAt = time.Now()
	return s.repaymentRepo.Update(repayment)
}