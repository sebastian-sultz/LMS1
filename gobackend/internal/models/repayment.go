package models

import (
	"time"

	"github.com/google/uuid"
)

type RepaymentStatus string

const (
	RepayPending RepaymentStatus = "pending"
	Paid         RepaymentStatus = "paid"
	Overdue      RepaymentStatus = "overdue"
)

type Repayment struct {
	ID        uuid.UUID       `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	LoanID    uuid.UUID       `gorm:"type:uuid;not null"`
	DueDate   time.Time       `gorm:"not null"`
	Amount    float64         `gorm:"not null"`
	Status    RepaymentStatus `gorm:"type:varchar(20);default:'pending'"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
