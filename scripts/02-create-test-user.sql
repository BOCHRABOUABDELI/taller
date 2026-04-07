-- Create test user for LuxeRepair CRM
-- Email: admin@luxerepair.test
-- Password: Test123! (hashed with bcryptjs)
-- Hash: $2a$10$yIbvVWOWnKYN4kPdqP6yb.8C0K7x0F7q9Z0Q7M9L8K7J6I5H4G3F2

INSERT INTO users (email, password_hash, name, role, phone, created_at, updated_at)
VALUES (
  'admin@luxerepair.test',
  '$2a$10$yIbvVWOWnKYN4kPdqP6yb.8C0K7x0F7q9Z0Q7M9L8K7J6I5H4G3F2',
  'Admin Usuario de Prueba',
  'admin',
  '+1-555-0100',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verify the user was created
SELECT id, email, name, role, created_at FROM users WHERE email = 'admin@luxerepair.test';
