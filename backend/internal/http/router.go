package http

import (
	"github.com/devslashrichie/resumero/internal/domain/energy"
	"github.com/devslashrichie/resumero/internal/domain/user"
	"github.com/devslashrichie/resumero/internal/http/handlers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter(userService *user.Service, energyService *energy.Service) *gin.Engine {
	r := gin.Default()

	r.Use(cors.Default())

	userHandler := handlers.NewUserHandler(userService)
	calculatePanels := handlers.NewEnergyHandler(energyService)

	r.POST("/users", userHandler.CreateUser)
	r.POST("/energy/calculate_panels", calculatePanels.CalcualtePanels)
	r.POST("/energy/calculate_from_file", calculatePanels.CalculatePanelsFromFile)
	r.POST("/energy/tts", calculatePanels.TextToTTS)
	r.POST("/energy/chat", calculatePanels.ChatWithSusana)
	r.GET("/energy/monthly_consumption", calculatePanels.GetMonthlyConsumption)

	return r
}
