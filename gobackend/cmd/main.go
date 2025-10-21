package main

import (
	"loan-microservice/internal/config"
	"loan-microservice/internal/database"
	"loan-microservice/internal/handlers"
	"loan-microservice/internal/models"
	"loan-microservice/internal/repositories"
	"loan-microservice/internal/services"

	jwt "github.com/appleboy/gin-jwt/v3"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"os"
	"time"
)

func main() {
	config.LoadEnv()

	db := database.Connect()
	if err := db.AutoMigrate(&models.Loan{}, &models.Repayment{}); err != nil {
		panic("Migration failed: " + err.Error())
	}

	loanRepo := repositories.NewLoanRepository(db)
	repaymentRepo := repositories.NewRepaymentRepository(db)
	loanService := services.NewLoanService(loanRepo, repaymentRepo)
	loanHandler := handlers.NewLoanHandler(loanService)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// JWT Middleware
	authMiddleware, err := initJWTMiddleware()
	if err != nil {
		panic("JWT init failed: " + err.Error())
	}
	authMiddleware.MiddlewareInit()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "OK"})
	})

	// Protected routes group
	auth := r.Group("/")
	auth.Use(authMiddleware.MiddlewareFunc())
	{
		auth.POST("/loans/apply", loanHandler.ApplyLoan)
		auth.GET("/loans/user", loanHandler.GetUserLoans)
		auth.GET("/repayments/:loan_id", loanHandler.GetRepayments)
		auth.GET("/loans", loanHandler.GetAllLoans)
		auth.POST("/loans/:id/approve", loanHandler.ApproveLoan)
		auth.POST("/loans/:id/reject", loanHandler.RejectLoan)
	}

	port := config.GetEnv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

// JWT Setup
func initJWTMiddleware() (*jwt.GinJWTMiddleware, error) {
	return jwt.New(&jwt.GinJWTMiddleware{
		Realm:         "loan-microservice",
		Key:           []byte(os.Getenv("JWT_SECRET")), // Same as Node
		Timeout:       time.Hour,
		MaxRefresh:    time.Hour * 24,
		TokenLookup:   "header: Authorization",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
		IdentityKey:   "user_id",

		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)
			return claims["user_id"]
		},

		Authorizer: func(c *gin.Context, data interface{}) bool {
			claims := jwt.ExtractClaims(c)
			path := c.FullPath()
			if path == "/loans" || path == "/loans/:id/approve" || path == "/loans/:id/reject" {
				return claims["isAdmin"] == true || claims["isAdmin"] == "true" 
			}
			return true
		},

		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{"error": message})
		},
	})
}
