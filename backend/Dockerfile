# Dockerfile

# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app/main ./cmd/server

# Final stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .
COPY db/migrations ./db/migrations

EXPOSE 8080

CMD ["/app/main"]
