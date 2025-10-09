package main

import (
	"fmt"
	"gobackend/helper"
	"strings"
)

var firstNames []string
var numberOfName int

func main() {

	fmt.Printf("How many username you want to enter usually user enters %v?", helper.GlobalVar)
	fmt.Scan(&numberOfName)

	names, isNameValid := helper.InputOutput(numberOfName)

	if isNameValid {
		for _, name := range names {

			var firstName = strings.Fields(name)
			if len(firstName) > 0 {
				firstNames = append(firstNames, firstName[0])
			}

		}

		fmt.Printf("All the firstnames are: %v \n", firstNames)
		fmt.Printf("All the Names are: %v \n", names)
	}

}
