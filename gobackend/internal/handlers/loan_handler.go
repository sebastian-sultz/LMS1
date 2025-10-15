package handlers

import (
	"loan-microservice/internal/services"
	"net/http"

	jwt "github.com/appleboy/gin-jwt/v3"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type LoanHandler struct {
	service services.LoanService
}

func NewLoanHandler(service services.LoanService) *LoanHandler {
	return &LoanHandler{service}
}

type ApplyLoanRequest struct {
	Amount   float64 `json:"amount" binding:"required,gt=0"`
	Term     int     `json:"term" binding:"required,gt=0"`
	LoanType string  `json:"type" binding:"required"`
}

func (h *LoanHandler) ApplyLoan(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	userID, ok := claims["user_id"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	var req ApplyLoanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	name := "User"
	loan, err := h.service.ApplyLoan(userID, name, req.Amount, req.Term, req.LoanType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, loan)
}

func (h *LoanHandler) GetAllLoans(c *gin.Context) {
	loans, err := h.service.GetAllLoans()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, loans)
}

func (h *LoanHandler) ApproveLoan(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	err = h.service.ApproveLoan(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Loan approved"})
}

type RejectLoanRequest struct {
	Reason string `json:"reason" binding:"required"`
}

func (h *LoanHandler) RejectLoan(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	var req RejectLoanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = h.service.RejectLoan(id, req.Reason)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Loan rejected"})
}

func (h *LoanHandler) GetUserLoans(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	userID, ok := claims["user_id"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	loans, err := h.service.GetUserLoans(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, loans)
}

func (h *LoanHandler) GetRepayments(c *gin.Context) {
	loanIDStr := c.Param("loan_id")
	loanID, err := uuid.Parse(loanIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid loan ID"})
		return
	}
	repayments, err := h.service.GetRepayments(loanID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, repayments)
}
