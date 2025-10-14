package models

import (
	"time"

	"github.com/google/uuid" // Keep for UUID type
)

type LoanStatus string

const (
	Pending  LoanStatus = "pending"
	Approved LoanStatus = "approved"
	Rejected LoanStatus = "rejected"
)

type Loan struct {
	ID              uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID          string     `gorm:"type:varchar(255);not null"`
	BorrowerName    string     `gorm:"type:varchar(255);not null"`
	Amount          float64    `gorm:"not null"`
	TermMonths      int        `gorm:"not null"`
	LoanType        string     `gorm:"type:varchar(50);not null"`
	Status          LoanStatus `gorm:"type:varchar(20);default:'pending'"`
	ApplicationDate time.Time  `gorm:"default:current_timestamp"`
	ApprovalDate    *time.Time
	RejectionReason *string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}
