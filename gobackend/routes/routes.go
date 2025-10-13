package routes

import (
	"loan-management-system/controllers"
	"loan-management-system/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	authController := controllers.NewAuthController()
	loanController := controllers.NewLoanController()

	// Public routes
	public := router.Group("/api")
	{
		public.POST("/register", authController.Register)
		public.POST("/login", authController.Login)
	}

	// Protected user routes
	user := router.Group("/api/user")
	user.Use(middleware.AuthMiddleware())
	{
		user.POST("/loans", loanController.ApplyForLoan)
		user.GET("/loans", loanController.GetUserLoans)
		user.GET("/loans/:id", loanController.GetLoanByID)
	}

	// Admin routes
	admin := router.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		admin.GET("/loans", loanController.GetAllLoans)
		admin.GET("/loans/:id", loanController.GetLoanByID)
		admin.PUT("/loans/:id/status", loanController.UpdateLoanStatus)
		admin.GET("/stats", loanController.GetLoanStatistics)
	}

	return router
}
