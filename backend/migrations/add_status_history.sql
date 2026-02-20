-- Create grievance status history table for timeline tracking
CREATE TABLE IF NOT EXISTS grievance_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grievance_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  changed_by INT NULL,
  admin_remark TEXT NULL,
  assigned_department VARCHAR(100) NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_grievance_id (grievance_id),
  CONSTRAINT fk_history_grievance FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);
