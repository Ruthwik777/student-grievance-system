const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const pool = require('../config/db');

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [[total]] = await pool.query('SELECT COUNT(*) AS total FROM grievances');
    const [[pending]] = await pool.query("SELECT COUNT(*) AS count FROM grievances WHERE status='Pending'");
    const [[progress]] = await pool.query("SELECT COUNT(*) AS count FROM grievances WHERE status='In Progress'");
    const [[resolved]] = await pool.query("SELECT COUNT(*) AS count FROM grievances WHERE status='Resolved'");

    res.json({
      total: total?.total || 0,
      pending: pending?.count || 0,
      inProgress: progress?.count || 0,
      resolved: resolved?.count || 0
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
});

router.get('/all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.*, u.name, u.email
      FROM grievances g
      JOIN users u ON g.student_id = u.id
      ORDER BY g.created_at DESC
    `);
    res.json(rows || []);
  } catch (err) {
    console.error('Get all grievances error:', err.message);
    res.status(500).json({ error: 'Failed to fetch grievances', details: err.message });
  }
});

router.put('/update/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status, admin_remark, assigned_department } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    
    await pool.query(
      'UPDATE grievances SET status=?, admin_remark=?, assigned_department=? WHERE id=?',
      [status, admin_remark || null, assigned_department || null, req.params.id]
    );

    await pool.query(
      'INSERT INTO grievance_status_history (grievance_id, status, changed_by, admin_remark, assigned_department) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, status, req.user.id, admin_remark || null, assigned_department || null]
    );
    res.json({ message: 'Grievance updated successfully' });
  } catch (err) {
    console.error('Update grievance error:', err.message);
    res.status(500).json({ error: 'Failed to update grievance', details: err.message });
  }
});

router.get('/history/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [history] = await pool.query(
      `SELECT h.status, h.admin_remark, h.assigned_department, h.changed_at, u.name AS changed_by_name, u.role AS changed_by_role
       FROM grievance_status_history h
       LEFT JOIN users u ON h.changed_by = u.id
       WHERE h.grievance_id=?
       ORDER BY h.changed_at ASC`,
      [req.params.id]
    );
    res.json(history || []);
  } catch (err) {
    console.error('Get grievance history error:', err.message);
    res.status(500).json({ error: 'Failed to fetch history', details: err.message });
  }
});

module.exports = router;
