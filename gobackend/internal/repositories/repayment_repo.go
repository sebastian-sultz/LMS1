package repositories

import (
	"loan-microservice/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RepaymentRepository interface {
	Create(repayment *models.Repayment) error
	FindByLoanID(loanID uuid.UUID) ([]models.Repayment, error)
}

type repaymentRepository struct {
	db *gorm.DB
}

func NewRepaymentRepository(db *gorm.DB) RepaymentRepository {
	return &repaymentRepository{db}
}

func (r *repaymentRepository) Create(repayment *models.Repayment) error {
	return r.db.Create(repayment).Error
}

func (r *repaymentRepository) FindByLoanID(loanID uuid.UUID) ([]models.Repayment, error) {
	var repayments []models.Repayment
	err := r.db.Where("loan_id = ?", loanID).Order("due_date ASC").Find(&repayments).Error
	return repayments, err
}
