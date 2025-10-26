package energy

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/devslashrichie/resumero/internal/external/gemini"
	"google.golang.org/genai"
)

const (
	costPerKWh        = 5.0 // MXN per kWh
	panelWattage      = 400 // Watts
	peakSunHours      = 5   // Hours per day
	daysInMonth       = 30
	costPerPanel      = 10000 // MXN
	co2EmissionFactor = 0.423 // kg CO2 per kWh
)

type EnergyAnalysisResult struct {
	MonthlyConsumption float64 `json:"monthlyConsumption"`
	MonthlyCost        float64 `json:"monthlyCost"`
	RecommendedPanels  int     `json:"recommendedPanels"`
	PanelProduction    float64 `json:"panelProduction"`
	MonthlySavings     float64 `json:"monthlySavings"`
	YearlySavings      float64 `json:"yearlySavings"`
	Surplus            float64 `json:"surplus"`
	BreakEvenYears     float64 `json:"breakEvenYears"`
	CarbonOffset       float64 `json:"carbonOffset"`
}

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

func (s *Service) CalculatePanelsFromFile(fileContent []byte, fileName string) (*EnergyAnalysisResult, error) {
	extractionQuery := `
		You are an expert in reading and extracting information from energy bills.
		Given the following text from an energy bill, please extract the total monthly energy consumption in kWh.
		The output must be a single number representing the kWh.
		Also find the cost of the current bill.

		Return Amounts.
	`

	consumptionStr, err := s.generator.GenerateWithFile(fileContent, fileName, "You are an expert in reading and extracting information from energy bills.", extractionQuery)
	if err != nil {
		return nil, err
	}

	var input struct {
		TotalKwh      int `json:"total_kwh"`
		LastMonthCost int `json:"last_month_cost"`
	}

	err = json.Unmarshal([]byte(*consumptionStr), &input)

	if err != nil {
		return nil, err
	}

	calculationQuery := fmt.Sprintf(`
		Given the following monthly energy consumption in kWh:
		- Monthly Consumption: %v kWh

		Estimate how many standard solar panels (assume 400W panels) are required to cover this energy consumption.
		Assume an average of 5 peak sun hours per day.
		Your response must be a **single number** representing the estimated number of panels needed (rounded to the nearest whole number).
		EXAMPLE:
		15
	`, input.TotalKwh)

	recommendedPanelsStr, err := s.generator.Generate("You are an expert in solar energy system design.", calculationQuery)
	if err != nil {
		return nil, err
	}

	recommendedPanels, err := strconv.Atoi(strings.TrimSpace(*recommendedPanelsStr))
	if err != nil {
		return nil, fmt.Errorf("failed to parse recommended panels: %w", err)
	}

	monthlyCost := float64(input.LastMonthCost)
	panelProduction := float64(recommendedPanels) * panelWattage * peakSunHours * daysInMonth / 1000
	monthlySavings := panelProduction * costPerKWh
	yearlySavings := monthlySavings * 12
	surplus := panelProduction - float64(input.LastMonthCost)
	totalInstallationCost := float64(recommendedPanels) * costPerPanel
	breakEvenYears := 0.0
	if yearlySavings > 0 {
		breakEvenYears = totalInstallationCost / yearlySavings
	}
	carbonOffset := panelProduction * 12 * co2EmissionFactor

	result := &EnergyAnalysisResult{
		MonthlyConsumption: float64(input.TotalKwh),
		MonthlyCost:        monthlyCost,
		RecommendedPanels:  recommendedPanels,
		PanelProduction:    panelProduction,
		MonthlySavings:     monthlySavings,
		YearlySavings:      yearlySavings,
		Surplus:            surplus,
		BreakEvenYears:     breakEvenYears,
		CarbonOffset:       carbonOffset,
	}

	return result, nil
}

func (s *Service) GenerateTTS(input string) ([]byte, error) {
	return s.ttsGenerator.Generate(input)
}

func (s *Service) ContinueChatting(history []string, newMessage string) (string, error) {
	genaiHistory := []*genai.Content{}
	for i, message := range history {
		role := genai.Role(genai.RoleUser)
		if i%2 == 0 {
			role = genai.Role(genai.RoleModel)
		}

		genaiHistory = append(genaiHistory, genai.NewContentFromText(message, role))
	}

	client := s.generator.(*gemini.Client)

	// Create a new chat session with the provided history
	chat, err := client.GetClient().Chats.Create(context.Background(), "gemini-2.5-flash", nil, genaiHistory)
	if err != nil {
		return "", fmt.Errorf("failed to create chat session: %w", err)
	}

	// Send the new message
	res, err := chat.SendMessage(context.Background(), genai.Part{Text: newMessage})
	if err != nil {
		return "", fmt.Errorf("failed to send message: %w", err)
	}

	// Extract the response text
	if len(res.Candidates) > 0 && len(res.Candidates[0].Content.Parts) > 0 {
		t := res.Candidates[0].Content.Parts[0].Text
		return t, nil
	}

	return "", errors.New("no response from model")
}
