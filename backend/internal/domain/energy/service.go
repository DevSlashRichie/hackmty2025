package energy

import (
	"errors"
	"fmt"
)

type Service struct {
	generator    Generator
	ttsGenerator TTSGenerator
}

func NewService(g Generator, t TTSGenerator) *Service {
	return &Service{
		generator:    g,
		ttsGenerator: t,
	}
}

func (s *Service) CalcualtePanels(amount_people, spaces, home_office int, electric_car bool, climate int) (*string, error) {

	if home_office > 3 {
		return nil, errors.New("unavailable.")
	}

	if climate > 4 {
		return nil, errors.New("unavailable.")
	}

	query := `
Given the following household parameters:
- Number of people: %v
- Number of spaces (rooms or general areas): %v
- Do you do home office? (0 = Yes, 1 = No, 2 = Sometimes): %v
- Has an electric car: %v
- How much you use your A/C (0 = All day, 1 = Only night, 2 = Ocasionalmentel, 3 = No): %v

Estimate how many standard solar panels are required to cover the average daily energy consumption of this house.

Your response must be a **single number** representing the estimated number of panels needed (rounded to the nearest whole number), based on realistic energy usage patterns and solar generation efficiency.
	EXAMPLE:
	10
	`

	query = fmt.Sprintf(query, amount_people, spaces, home_office, electric_car, climate)

	return s.generator.Generate("You are an expert in solar energy system design.", query)
}

func (s *Service) CalculatePanelsFromFile(fileContent []byte, fileName string) (*string, error) {
	extractionQuery := `
		You are an expert in reading and extracting information from energy bills.
		Given the following text from an energy bill, please extract the total monthly energy consumption in kWh.
		The output must be a single number representing the kWh.

		EXAMPLE:
		350
	`

	consumption, err := s.generator.GenerateWithFile(fileContent, fileName, "You are an expert in reading and extracting information from energy bills.", extractionQuery)

	fmt.Println(consumption)
	if err != nil {
		return nil, err
	}

	calculationQuery := fmt.Sprintf(`
		Given the following monthly energy consumption in kWh:
		- Monthly Consumption: %s kWh

		Estimate how many standard solar panels (assume 400W panels) are required to cover this energy consumption.
		Assume an average of 5 peak sun hours per day.
		Your response must be a **single number** representing the estimated number of panels needed (rounded to the nearest whole number).
		EXAMPLE:
		15
	`, *consumption)

	return s.generator.Generate("You are an expert in solar energy system design.", calculationQuery)
}

func (s *Service) GenerateTTS(input string) ([]byte, error) {
	return s.ttsGenerator.Generate(input)
}
