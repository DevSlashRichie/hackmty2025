package handlers

import (
	"bytes"
	"net/http"

	"github.com/devslashrichie/resumero/internal/domain/energy"
	"github.com/gin-gonic/gin"
)

type EnergyHandler struct {
	service *energy.Service
}

func NewEnergyHandler(s *energy.Service) *EnergyHandler {
	return &EnergyHandler{service: s}
}

func (h *EnergyHandler) CalcualtePanels(c *gin.Context) {
	var input struct {
		AmountPeople int  `json:"amount_people"`
		Spaces       int  `json:"spaces"`
		HomeOffice   int  `json:"home_office"`
		ElectricCar  bool `json:"electric_car"`
		Climate      int  `json:"climate"`
	}

	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Panel calculations validation failed!",
			"error":   err.Error(),
		})
		return
	}

	u, err := h.service.CalcualtePanels(input.AmountPeople, input.Spaces, input.HomeOffice, input.ElectricCar, input.Climate)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Could not calculate panels.",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, u)

}

func (h *EnergyHandler) CalculatePanelsFromFile(c *gin.Context) {
	file, err := c.FormFile("bill")

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{

			"message": "Could not get uploaded file.",

			"error": err.Error(),
		})

		return

	}

	openedFile, err := file.Open()

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{

			"message": "Could not open uploaded file.",

			"error": err.Error(),
		})

		return

	}

	defer openedFile.Close()

	buf := new(bytes.Buffer)

	buf.ReadFrom(openedFile)

	fileContent := buf.Bytes()

	panels, err := h.service.CalculatePanelsFromFile(fileContent, file.Filename)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{

			"message": "Could not calculate panels from file.",

			"error": err.Error(),
		})

		return

	}

	c.JSON(http.StatusOK, gin.H{"panels": panels})

}

func (h *EnergyHandler) GetMonthlyConsumption(c *gin.Context) {
	month := c.Query("month")

	mockConsumptionData := []gin.H{
		{"month": "January", "consumption": 150.5},
		{"month": "February", "consumption": 160.2},
		{"month": "March", "consumption": 155.8},
		{"month": "April", "consumption": 145.3},
		{"month": "May", "consumption": 140.1},
		{"month": "June", "consumption": 135.9},
		{"month": "July", "consumption": 130.5},
		{"month": "August", "consumption": 138.7},
		{"month": "September", "consumption": 142.6},
		{"month": "October", "consumption": 148.9},
		{"month": "November", "consumption": 152.3},
		{"month": "December", "consumption": 158.0},
	}

	if month != "" {
		for _, data := range mockConsumptionData {
			if data["month"] == month {
				c.JSON(http.StatusOK, []gin.H{
					data,
				})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"message": "No data found for the specified month"})
		return
	}

	c.JSON(http.StatusOK, mockConsumptionData)
}
