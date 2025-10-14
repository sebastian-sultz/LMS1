package repositories

import (
	"loan-microservice/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LoanRepository interface {
	Create(loan *models.Loan) error
	FindAll() ([]models.Loan, error)
	FindByID(id uuid.UUID) (*models.Loan, error)
	FindByUserID(userID string) ([]models.Loan, error)
	Update(loan *models.Loan) error
}

type loanRepository struct {
	db *gorm.DB
}

func NewLoanRepository(db *gorm.DB) LoanRepository {
	return &loanRepository{db}
}

func (r *loanRepository) Create(loan *models.Loan) error {
	return r.db.Create(loan).Error
}

func (r *loanRepository) FindAll() ([]models.Loan, error) {
	var loans []models.Loan
	err := r.db.Find(&loans).Error
	return loans, err
}

func (r *loanRepository) FindByID(id uuid.UUID) (*models.Loan, error) {
	var loan models.Loan
	err := r.db.First(&loan, id).Error
	return &loan, err
}

func (r *loanRepository) FindByUserID(userID string) ([]models.Loan, error) {
	var loans []models.Loan
	err := r.db.Where("user_id = ?", userID).Find(&loans).Error
	return loans, err
}

func (r *loanRepository) Update(loan *models.Loan) error {
	return r.db.Save(loan).Error
}