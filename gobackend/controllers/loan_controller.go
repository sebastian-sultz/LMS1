package controllers

import (
	"loan-management-system/database"
	"loan-management-system/models"
	"loan-management-system/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type LoanController struct {
	DB *gorm.DB
}

func NewLoanController() *LoanController {
	return &LoanController{DB: database.DB}
}

// Apply for loan
func (lc *LoanController) ApplyForLoan(c *gin.Context) {
	userID, _ := c.Get("userID")

	var loanApplication struct {
		Amount        float64 `json:"amount" binding:"required"`
		RepaymentTerm int     `json:"repayment_term" binding:"required"`
		LoanType      string  `json:"loan_type" binding:"required"`
		Purpose       string  `json:"purpose"`
	}

	if err := c.ShouldBindJSON(&loanApplication); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err)
		return
	}

	loan := models.Loan{
		UserID:        userID.(uint),
		Amount:        loanApplication.Amount,
		RepaymentTerm: loanApplication.RepaymentTerm,
		LoanType:      loanApplication.LoanType,
		Purpose:       loanApplication.Purpose,
		Status:        "pending",
	}

	if err := lc.DB.Create(&loan).Error; err != nil {
		utils.JSONError(c, http.StatusInternalServerError, err)
		return
	}

	// Load user details for response
	lc.DB.Preload("User").First(&loan, loan.ID)

	utils.JSONResponse(c, http.StatusCreated, loan)
}

// Get user's loans
func (lc *LoanController) GetUserLoans(c *gin.Context) {
	userID, _ := c.Get("userID")

	var loans []models.Loan
	if err := lc.DB.Where("user_id = ?", userID).Preload("User").Find(&loans).Error; err != nil {
		utils.JSONError(c, http.StatusInternalServerError, err)
		return
	}

	utils.JSONResponse(c, http.StatusOK, loans)
}

// Get all loans (Admin only)
func (lc *LoanController) GetAllLoans(c *gin.Context) {
	var loans []models.Loan
	if err := lc.DB.Preload("User").Find(&loans).Error; err != nil {
		utils.JSONError(c, http.StatusInternalServerError, err)
		return
	}

	utils.JSONResponse(c, http.StatusOK, loans)
}

// Get loan by ID
func (lc *LoanController) GetLoanByID(c *gin.Context) {
	loanID := c.Param("id")

	var loan models.Loan
	if err := lc.DB.Preload("User").First(&loan, loanID).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, err)
		return
	}

	utils.JSONResponse(c, http.StatusOK, loan)
}

// Admin: Approve or reject loan
func (lc *LoanController) UpdateLoanStatus(c *gin.Context) {
	loanID := c.Param("id")

	var statusUpdate struct {
		Status          string `json:"status" binding:"required"` // approved, rejected
		RejectionReason string `json:"rejection_reason"`
	}

	if err := c.ShouldBindJSON(&statusUpdate); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err)
		return
	}

	var loan models.Loan
	if err := lc.DB.First(&loan, loanID).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, err)
		return
	}

	loan.Status = statusUpdate.Status
	loan.RejectionReason = statusUpdate.RejectionReason

	now := time.Now()
	if statusUpdate.Status == "approved" {
		loan.ApprovedAt = &now
	} else if statusUpdate.Status == "rejected" {
		loan.RejectedAt = &now
	}

	if err := lc.DB.Save(&loan).Error; err != nil {
		utils.JSONError(c, http.StatusInternalServerError, err)
		return
	}

	// Load updated loan with user
	lc.DB.Preload("User").First(&loan, loan.ID)

	utils.JSONResponse(c, http.StatusOK, loan)
}

// Get loan statistics (Admin only)
func (lc *LoanController) GetLoanStatistics(c *gin.Context) {
	var stats struct {
		TotalLoans    int64   `json:"total_loans"`
		PendingLoans  int64   `json:"pending_loans"`
		ApprovedLoans int64   `json:"approved_loans"`
		RejectedLoans int64   `json:"rejected_loans"`
		TotalAmount   float64 `json:"total_amount"`
		AverageAmount float64 `json:"average_amount"`
	}

	lc.DB.Model(&models.Loan{}).Count(&stats.TotalLoans)
	lc.DB.Model(&models.Loan{}).Where("status = ?", "pending").Count(&stats.PendingLoans)
	lc.DB.Model(&models.Loan{}).Where("status = ?", "approved").Count(&stats.ApprovedLoans)
	lc.DB.Model(&models.Loan{}).Where("status = ?", "rejected").Count(&stats.RejectedLoans)
	lc.DB.Model(&models.Loan{}).Select("COALESCE(SUM(amount), 0)").Row().Scan(&stats.TotalAmount)

	if stats.TotalLoans > 0 {
		stats.AverageAmount = stats.TotalAmount / float64(stats.TotalLoans)
	}

	utils.JSONResponse(c, http.StatusOK, stats)
}
