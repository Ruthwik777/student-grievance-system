const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const pool = require('../config/db');
const { logger } = require('../utils/logger');

// Middleware to require admin access
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get category-wise statistics
router.get('/category-stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved_count,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_count
      FROM grievances
      GROUP BY category
      ORDER BY count DESC
    `);
    
    res.json(results || []);
  } catch (err) {
    logger.error('Failed to fetch category stats', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
});

// Get monthly trend data
router.get('/monthly-trend', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending
      FROM grievances
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);
    
    res.json(results || []);
  } catch (err) {
    logger.error('Failed to fetch monthly trend', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch monthly trend data' });
  }
});

// Get average resolution time
router.get('/resolution-time', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        category,
        AVG(TIMESTAMPDIFF(HOUR, g.created_at, h.changed_at)) as avg_hours,
        COUNT(*) as resolved_count
      FROM grievances g
      JOIN grievance_status_history h ON g.id = h.grievance_id
      WHERE h.status = 'Resolved'
      GROUP BY category
      ORDER BY avg_hours ASC
    `);
    
    res.json(results || []);
  } catch (err) {
    logger.error('Failed to fetch resolution time', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch resolution time data' });
  }
});

// Get department workload
router.get('/department-workload', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        COALESCE(assigned_department, 'Unassigned') as department,
        COUNT(*) as total_grievances,
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending
      FROM grievances
      GROUP BY assigned_department
      ORDER BY total_grievances DESC
    `);
    
    res.json(results || []);
  } catch (err) {
    logger.error('Failed to fetch department workload', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch department workload data' });
  }
});

// Get recent activity
router.get('/recent-activity', verifyToken, requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const [results] = await pool.query(`
      SELECT 
        h.grievance_id,
        h.status,
        h.changed_at,
        h.admin_remark,
        u.name as changed_by_name,
        g.category,
        s.name as student_name
      FROM grievance_status_history h
      LEFT JOIN users u ON h.changed_by = u.id
      LEFT JOIN grievances g ON h.grievance_id = g.id
      LEFT JOIN users s ON g.student_id = s.id
      ORDER BY h.changed_at DESC
      LIMIT ?
    `, [limit]);
    
    res.json(results || []);
  } catch (err) {
    logger.error('Failed to fetch recent activity', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Get user statistics (for student dashboard)
router.get('/my-stats', verifyToken, async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
      FROM grievances
      WHERE student_id = ?
    `, [req.user.id]);
    
    res.json(stats || { total: 0, pending: 0, in_progress: 0, resolved: 0 });
  } catch (err) {
    logger.error('Failed to fetch user stats', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;
