package models

import (
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	FirstName string    `gorm:"not null" json:"first_name"`
	LastName  string    `gorm:"not null" json:"last_name"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	Role      string    `gorm:"default:user" json:"role"` // user, admin
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Loan struct {
	ID              uint       `gorm:"primaryKey" json:"id"`
	UserID          uint       `gorm:"not null" json:"user_id"`
	User            User       `gorm:"foreignKey:UserID" json:"user"`
	Amount          float64    `gorm:"not null" json:"amount"`
	RepaymentTerm   int        `gorm:"not null" json:"repayment_term"` // in months
	LoanType        string     `gorm:"not null" json:"loan_type"`      // car, home, personal, etc.
	Purpose         string     `json:"purpose"`
	Status          string     `gorm:"default:pending" json:"status"` // pending, approved, rejected
	RejectionReason string     `json:"rejection_reason"`
	ApplicationDate time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"application_date"`
	ApprovedAt      *time.Time `json:"approved_at"`
	RejectedAt      *time.Time `json:"rejected_at"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type LoanPayment struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	LoanID    uint       `gorm:"not null" json:"loan_id"`
	Loan      Loan       `gorm:"foreignKey:LoanID" json:"loan"`
	Amount    float64    `gorm:"not null" json:"amount"`
	DueDate   time.Time  `gorm:"not null" json:"due_date"`
	Status    string     `gorm:"default:pending" json:"status"` // pending, paid, overdue
	PaidAt    *time.Time `json:"paid_at"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}
