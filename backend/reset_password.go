package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	connStr := "postgresql://postgres.wsdhumiwikldvpjiksag:Grawizah.1285@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}
	defer db.Close()

	password := "Grawizah123"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("❌ Failed to hash password: %v", err)
	}

	res, err := db.Exec("UPDATE users SET password_hash = $1 WHERE email = 'wisnualfian117@gmail.com'", string(hashedPassword))
	if err != nil {
		log.Fatalf("❌ Failed to update password: %v", err)
	}

	rows, _ := res.RowsAffected()
	if rows == 0 {
		log.Fatalf("❌ No user found with email 'wisnualfian117@gmail.com'")
	}

	fmt.Printf("✅ Password successfully reset for wisnualfian117@gmail.com\nNew Password: %s\n", password)
}
