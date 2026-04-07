package services

import (
	"fmt"
	"net/smtp"

	"grawizah.com/backend/internal/config"
)

type EmailService struct {
	cfg *config.Config
}

func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{cfg: cfg}
}

// SendEmail sends an email via SMTP
func (s *EmailService) SendEmail(to, subject, body string) error {
	if s.cfg.SMTPUser == "" || s.cfg.SMTPPassword == "" {
		// SMTP not configured, log instead of failing
		return fmt.Errorf("SMTP not configured - would send email to %s: %s", to, subject)
	}

	auth := smtp.PlainAuth("", s.cfg.SMTPUser, s.cfg.SMTPPassword, s.cfg.SMTPHost)
	addr := fmt.Sprintf("%s:%d", s.cfg.SMTPHost, s.cfg.SMTPPort)

	message := fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s",
		s.cfg.SMTPFrom, to, subject, body,
	)

	return smtp.SendMail(addr, auth, s.cfg.SMTPFrom, []string{to}, []byte(message))
}

// SendWelcomeEmail sends a welcome email to new users
func (s *EmailService) SendWelcomeEmail(to, name string) error {
	subject := "Welcome to Grawizah - Intelligent Global Trade Hub"
	body := fmt.Sprintf(`
	<html>
	<body style="font-family: Montserrat, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
		<div style="background: linear-gradient(135deg, #6D28D9, #3B82F6); padding: 40px; text-align: center;">
			<h1 style="color: white; margin: 0;">Welcome to Grawizah!</h1>
		</div>
		<div style="padding: 40px; background: #f9fafb;">
			<h2 style="color: #1f2937;">Hello %s,</h2>
			<p style="color: #4b5563; line-height: 1.6;">
				Thank you for joining Grawizah - The Next-Gen B2B Export-Import Intelligence Hub.
			</p>
			<p style="color: #4b5563; line-height: 1.6;">
				You now have access to:
			</p>
			<ul style="color: #4b5563; line-height: 1.8;">
				<li>🌍 Global B2B Directory</li>
				<li>🤖 AI-Powered HS Code Classification</li>
				<li>🔒 Sanction Screening</li>
				<li>📊 Market Intelligence</li>
			</ul>
			<p style="color: #4b5563; line-height: 1.6;">
				To get started, please verify your company documents to unlock all features.
			</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="#" style="background: #6D28D9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
					Get Started
				</a>
			</div>
		</div>
		<div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
			<p>Grawizah Intelligence Hub - 2026</p>
			<p>Secure, Fast, & Intelligent Global Trade</p>
		</div>
	</body>
	</html>
	`, name)

	return s.SendEmail(to, subject, body)
}

// SendOTP sends an OTP code for email verification
func (s *EmailService) SendOTP(to, otp string) error {
	subject := "Your Grawizah Verification Code"
	body := fmt.Sprintf(`
	<html>
	<body style="font-family: Montserrat, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
		<div style="background: linear-gradient(135deg, #6D28D9, #3B82F6); padding: 40px; text-align: center;">
			<h1 style="color: white; margin: 0;">Email Verification</h1>
		</div>
		<div style="padding: 40px; background: #f9fafb; text-align: center;">
			<p style="color: #4b5563;">Your verification code is:</p>
			<div style="background: white; border: 2px dashed #6D28D9; padding: 20px; margin: 20px 0;">
				<h1 style="color: #6D28D9; margin: 0; letter-spacing: 10px; font-size: 36px;">%s</h1>
			</div>
			<p style="color: #4b5563;">This code expires in 10 minutes.</p>
		</div>
		<div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
			<p>Grawizah Intelligence Hub - 2026</p>
		</div>
	</body>
	</html>
	`, otp)

	return s.SendEmail(to, subject, body)
}

// SendPasswordReset sends a password reset email
func (s *EmailService) SendPasswordReset(to, resetURL string) error {
	subject := "Reset Your Grawizah Password"
	body := fmt.Sprintf(`
	<html>
	<body style="font-family: Montserrat, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
		<div style="background: linear-gradient(135deg, #6D28D9, #3B82F6); padding: 40px; text-align: center;">
			<h1 style="color: white; margin: 0;">Password Reset</h1>
		</div>
		<div style="padding: 40px; background: #f9fafb;">
			<p style="color: #4b5563;">Click the button below to reset your password:</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="%s" style="background: #6D28D9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
					Reset Password
				</a>
			</div>
			<p style="color: #4b5563; font-size: 12px;">This link expires in 1 hour.</p>
		</div>
		<div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
			<p>Grawizah Intelligence Hub - 2026</p>
		</div>
	</body>
	</html>
	`, resetURL)

	return s.SendEmail(to, subject, body)
}
