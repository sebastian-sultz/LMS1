package main

import (
	"loan-management-system/database"
	"loan-management-system/routes"
)

func main() {
	// Initialize database
	database.ConnectDB()

	// Setup router
	router := routes.SetupRouter()

	// Start server
	router.Run(":8080")
}
