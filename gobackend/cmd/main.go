package main

import (
	"loan-microservice/internal/config"
	"loan-microservice/internal/database"
	"loan-microservice/internal/handlers"
	"loan-microservice/internal/models"
	"loan-microservice/internal/repositories"
	"loan-microservice/internal/services"

	"github.com/gin-contrib/cors" // Added for CORS
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()

	db := database.Connect()
	// Handle migration errors gracefully
	if err := db.AutoMigrate(&models.Loan{}, &models.Repayment{}); err != nil {
		panic("Failed to migrate database: " + err.Error())
	}

	loanRepo := repositories.NewLoanRepository(db)
	repaymentRepo := repositories.NewRepaymentRepository(db)
	loanService := services.NewLoanService(loanRepo, repaymentRepo)
	loanHandler := handlers.NewLoanHandler(loanService)

	r := gin.Default()

	// Add CORS middleware (allows Node/React to call Go)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5000"}, // React & Node
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           12 * 3600, // 12 hours
	}))

	// Health check endpoint (for testing)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "OK", "message": "Go microservice ready"})
	})

	// Routes
	r.POST("/loans/apply", loanHandler.ApplyLoan)
	r.GET("/loans", loanHandler.GetAllLoans) // Admin
	r.POST("/loans/:id/approve", loanHandler.ApproveLoan)
	r.POST("/loans/:id/reject", loanHandler.RejectLoan)
	r.GET("/loans/user/:user_id", loanHandler.GetUserLoans)
	r.GET("/repayments/:loan_id", loanHandler.GetRepayments)

	port := config.GetEnv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
