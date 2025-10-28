package models

import (
	"time"
	"github.com/google/uuid"
)

type LoanStatus string

const (
	Pending  LoanStatus = "pending"
	Approved LoanStatus = "approved"
	Rejected LoanStatus = "rejected"
)

type Loan struct {
	ID              uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"ID"`
	UserID          string     `gorm:"type:varchar(255);not null" json:"UserID"`
	BorrowerName    string     `gorm:"type:varchar(255);not null" json:"BorrowerName"`
	Amount          float64    `gorm:"not null" json:"Amount"`
	InterestRate    float64    `gorm:"not null;default:0.0" json:"InterestRate"` // Added InterestRate
	TermMonths      int        `gorm:"not null" json:"TermMonths"`
	LoanType        string     `gorm:"type:varchar(50);not null" json:"LoanType"`
	Status          LoanStatus `gorm:"type:varchar(20);default:'pending'" json:"Status"`
	ApplicationDate time.Time  `gorm:"default:current_timestamp" json:"ApplicationDate"`
	ApprovalDate    *time.Time `json:"ApprovalDate"`
	RejectionReason *string    `json:"RejectionReason"`
	CreatedAt       time.Time  `json:"CreatedAt"`
	UpdatedAt       time.Time  `json:"UpdatedAt"`
}