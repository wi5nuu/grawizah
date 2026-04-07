package middleware

import (
	"net/http"
	"sync"
	"time"
)

type RateLimiter struct {
	requests map[string][]time.Time
	mu       sync.Mutex
	limit    int
	window   time.Duration
}

var rateLimiter *RateLimiter

func InitRateLimiter(limit int, windowSeconds int) {
	rateLimiter = &RateLimiter{
		requests: make(map[string][]time.Time),
		limit:    limit,
		window:   time.Duration(windowSeconds) * time.Second,
	}
}

func RateLimitMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if rateLimiter == nil {
				next.ServeHTTP(w, r)
				return
			}

			ip := r.RemoteAddr
			if !rateLimiter.allow(ip) {
				w.Header().Set("Content-Type", "application/json")
				w.Header().Set("Retry-After", "60")
				w.WriteHeader(http.StatusTooManyRequests)
				w.Write([]byte(`{"success":false,"error":"Rate limit exceeded. Please try again later."}`))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (rl *RateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	windowStart := now.Add(-rl.window)

	// Get existing requests for this IP
	requests, exists := rl.requests[ip]
	if !exists {
		requests = []time.Time{}
	}

	// Remove old requests
	validRequests := []time.Time{}
	for _, t := range requests {
		if t.After(windowStart) {
			validRequests = append(validRequests, t)
		}
	}

	// Check if limit exceeded
	if len(validRequests) >= rl.limit {
		return false
	}

	// Add new request
	validRequests = append(validRequests, now)
	rl.requests[ip] = validRequests

	return true
}

// Cleanup old entries periodically
func (rl *RateLimiter) StartCleanup(interval time.Duration) {
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			rl.mu.Lock()
			now := time.Now()
			windowStart := now.Add(-rl.window)

			for ip, requests := range rl.requests {
				validRequests := []time.Time{}
				for _, t := range requests {
					if t.After(windowStart) {
						validRequests = append(validRequests, t)
					}
				}
				if len(validRequests) == 0 {
					delete(rl.requests, ip)
				} else {
					rl.requests[ip] = validRequests
				}
			}
			rl.mu.Unlock()
		}
	}()
}
