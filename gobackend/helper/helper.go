package helper

import "fmt"

var GlobalVar int = 10

func InputOutput(numberOfName int) ([]string, bool) {

	var names []string
	var isNameValid bool = true

	for i := 0; i < numberOfName; i++ {

		var firstName string
		var lastName string

		fmt.Println("Enter First Name: ")
		fmt.Scan(&firstName)

		fmt.Println("Enter Last Name: ")
		fmt.Scan(&lastName)

		isNameValid = len(firstName) > 2 && len(lastName) > 2
		if !isNameValid {
			fmt.Print("The Name provided is not valid")
			break
		}
		fullName := firstName + " " + lastName
		names = append(names, fullName)

	}
	return names, isNameValid

}
