package main

import (
	"context"
	"fmt"
	"os"

	"github.com/devslashrichie/resumero/internal/domain/energy"
	"github.com/devslashrichie/resumero/internal/domain/user"
	"github.com/devslashrichie/resumero/internal/external/elevenlabs"
	"github.com/devslashrichie/resumero/internal/external/gemini"
	"github.com/devslashrichie/resumero/internal/http"
	"github.com/devslashrichie/resumero/internal/repository/postgres"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		fmt.Println("Error loading .env file")
	}

	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))

	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database %v\n", err)
	}
	defer conn.Close(context.Background())

	userRepo := postgres.NewUserRepository(conn)
	userService := user.NewService(userRepo)

	geminiClient, err := gemini.NewClient(os.Getenv("GEMINI_API_KEY"))

	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to gemini %v\n", err)
	}

	elevenClient := elevenlabs.NewClient(os.Getenv("ELEVEN_API_KEY"))

	energyService := energy.NewService(geminiClient, elevenClient)

	r := http.NewRouter(userService, energyService)

	r.Run()
}
