package controllers

import (
	"loan-management-system/config"
	"loan-management-system/database"
	"loan-management-system/models"
	"loan-management-system/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthController struct {
	DB *gorm.DB
}

func NewAuthController() *AuthController {
	return &AuthController{DB: database.DB}
}

// Register user
func (ac *AuthController) Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.JSONError(c, http.StatusInternalServerError, err)
		return
	}
	user.Password = string(hashedPassword)

	// Create user
	if err := ac.DB.Create(&user).Error; err != nil {
		utils.JSONError(c, http.StatusInternalServerError, err)
		return
	}

	// Remove password from response
	user.Password = ""

	utils.JSONResponse(c, http.StatusCreated, user)
}

// Login user
func (ac *AuthController) Login(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err)
		return
	}

	var user models.User
	if err := ac.DB.Where("email = ?", loginData.Email).First(&user).Error; err != nil {
		utils.JSONError(c, http.StatusUnauthorized, err)
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password)); err != nil {
		utils.JSONError(c, http.StatusUnauthorized, err)
		return
	}

	// Generate JWT token
	cfg := config.LoadConfig()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": user.ID,
		"role":   user.Role,
		"exp":    time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
	if err != nil {
		utils.JSONError(c, http.StatusInternalServerError, err)
		return
	}

	utils.JSONResponse(c, http.StatusOK, gin.H{
		"token": tokenString,
		"user":  user,
	})
}
