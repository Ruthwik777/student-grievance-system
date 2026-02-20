-- Add reset_token column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN reset_token VARCHAR(500) DEFAULT NULL;
