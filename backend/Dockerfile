# Stage 1: Build
FROM golang:1.23-alpine AS builder

# Install necessary packages
RUN apk add --no-cache git ca-certificates

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
# CGO_ENABLED=0 wajib untuk binary statis di Alpine
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Stage 2: Run
FROM alpine:latest

# Install base necessities
RUN apk --no-cache add ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/main .

# Pastikan binary memiliki izin eksekusi
RUN chmod +x /app/main

# Salin file environment jika ada (Opsional untuk HF karena pakai Secrets)
# COPY --from=builder /app/.env.example .env.example

# SEMENTARA: Jalankan sebagai root (default) untuk memastikan tidak ada 
# hambatan pada sandboxing port 7860 di Hugging Face CPU Basic.
# USER 1001 

# Pastikan variabel lingkungan PORT tetap ada
ENV PORT=7860

# Expose port (Informasional untuk Docker)
EXPOSE 7860

# ENTRYPOINT adalah cara paling pasti menjalankan process utama (PID 1)
# Ini menjamin binary Go mengontrol kontainer sepenuhnya.
ENTRYPOINT ["/app/main"]
