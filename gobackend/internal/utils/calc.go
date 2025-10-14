package utils

import "math"

var InterestRates = map[string]float64{
	"home": 8.0,
	"gold": 12.0,
	// Add more types here
}

func CalculateEMI(principal float64, annualRate float64, months int) float64 {
	if months == 0 || annualRate == 0 {
		return principal / float64(months)
	}
	r := (annualRate / 12) / 100
	pow := math.Pow(1+r, float64(months))
	emi := principal * r * pow / (pow - 1)
	return math.Round(emi*100) / 100 // 2 decimal places
}
