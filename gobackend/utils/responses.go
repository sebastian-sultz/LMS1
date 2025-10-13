package utils

import "github.com/gin-gonic/gin"

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func JSONResponse(c *gin.Context, statusCode int, data interface{}) {
	c.JSON(statusCode, Response{
		Success: statusCode >= 200 && statusCode < 300,
		Message: getStatusMessage(statusCode),
		Data:    data,
	})
}

func JSONError(c *gin.Context, statusCode int, err error) {
	c.JSON(statusCode, Response{
		Success: false,
		Message: getStatusMessage(statusCode),
		Error:   err.Error(),
	})
}

func getStatusMessage(statusCode int) string {
	switch statusCode {
	case 200:
		return "Success"
	case 201:
		return "Created successfully"
	case 400:
		return "Bad request"
	case 401:
		return "Unauthorized"
	case 404:
		return "Not found"
	case 500:
		return "Internal server error"
	default:
		return ""
	}
}
