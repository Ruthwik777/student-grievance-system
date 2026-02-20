-- Student Grievance System Database Schema
-- Run this script to create all necessary tables

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS grievance_system;
USE grievance_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin', 'faculty') DEFAULT 'student',
  reset_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Grievances table
CREATE TABLE IF NOT EXISTS grievances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  attachment_path VARCHAR(255),
  status ENUM('Pending', 'In Progress', 'Resolved', 'Rejected') DEFAULT 'Pending',
  admin_remark TEXT,
  assigned_department VARCHAR(100),
  priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Grievance status history table
CREATE TABLE IF NOT EXISTS grievance_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  grievance_id INT NOT NULL,
  status ENUM('Pending', 'In Progress', 'Resolved', 'Rejected') NOT NULL,
  changed_by INT,
  admin_remark TEXT,
  assigned_department VARCHAR(100),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_grievance_id (grievance_id),
  INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Comments/Messages table for communication
CREATE TABLE IF NOT EXISTS grievance_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  grievance_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_grievance_id (grievance_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  grievance_id INT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  head_name VARCHAR(100),
  contact_email VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default departments
INSERT INTO departments (name, description, is_active) VALUES
('Academic Affairs', 'Handles academic-related grievances', TRUE),
('Administration', 'Handles administrative issues', TRUE),
('Infrastructure', 'Manages infrastructure and facility issues', TRUE),
('Hostel Management', 'Handles hostel-related complaints', TRUE),
('Student Services', 'General student services and support', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Create default admin user (password: admin123)
-- Hash generated using bcryptjs with 10 rounds
INSERT INTO users (name, email, password_hash, role) VALUES
('System Admin', 'admin@grievance.edu', '$2a$10$rHQYQrTZE.0BfKKYJj6hGuqJNIW8J5FZ8Z8lXEKnNQRQp3H5K8dh6', 'admin')
ON DUPLICATE KEY UPDATE name=name;

-- Views for analytics

-- View: Grievance Summary
CREATE OR REPLACE VIEW grievance_summary AS
SELECT 
  g.id,
  g.category,
  g.status,
  g.priority,
  g.created_at,
  g.resolved_at,
  TIMESTAMPDIFF(HOUR, g.created_at, COALESCE(g.resolved_at, NOW())) as hours_since_creation,
  u.name as student_name,
  u.email as student_email,
  g.assigned_department
FROM grievances g
JOIN users u ON g.student_id = u.id;

-- View: Department Performance
CREATE OR REPLACE VIEW department_performance AS
SELECT 
  COALESCE(assigned_department, 'Unassigned') as department,
  COUNT(*) as total_grievances,
  SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved_count,
  SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_count,
  AVG(CASE 
    WHEN status = 'Resolved' 
    THEN TIMESTAMPDIFF(HOUR, created_at, resolved_at) 
    END
  ) as avg_resolution_hours
FROM grievances
GROUP BY assigned_department;

-- Trigger: Update resolved_at timestamp
DELIMITER //
CREATE TRIGGER update_resolved_at
BEFORE UPDATE ON grievances
FOR EACH ROW
BEGIN
  IF NEW.status = 'Resolved' AND OLD.status != 'Resolved' THEN
    SET NEW.resolved_at = NOW();
  END IF;
END//
DELIMITER ;

-- Trigger: Create notification on status change
DELIMITER //
CREATE TRIGGER create_status_notification
AFTER UPDATE ON grievances
FOR EACH ROW
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO notifications (user_id, grievance_id, title, message)
    VALUES (
      NEW.student_id,
      NEW.id,
      CONCAT('Grievance #', NEW.id, ' status updated'),
      CONCAT('Your grievance status has been changed to: ', NEW.status)
    );
  END IF;
END//
DELIMITER ;

-- Sample indexes for performance optimization
CREATE INDEX idx_grievance_status_date ON grievances(status, created_at);
CREATE INDEX idx_user_role_created ON users(role, created_at);

-- Display table information
SELECT 'Database schema created successfully!' as message;
SELECT 
  TABLE_NAME as 'Table',
  TABLE_ROWS as 'Rows'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'grievance_system'
AND TABLE_TYPE = 'BASE TABLE';
