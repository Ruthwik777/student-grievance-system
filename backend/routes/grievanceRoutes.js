const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');
const pool = require('../config/db');

router.post('/', verifyToken, upload.single('attachment'), async (req, res) => {
  try {
    const { category, description } = req.body;
    if (!category || !description) return res.status(400).json({ error: 'Category and description required' });
    
    const attachmentPath = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await pool.query(
      'INSERT INTO grievances (student_id, category, description, attachment_path, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, category, description, attachmentPath, 'Pending']
    );

    const grievanceId = result.insertId;
    await pool.query(
      'INSERT INTO grievance_status_history (grievance_id, status, changed_by) VALUES (?, ?, ?)',
      [grievanceId, 'Pending', req.user.id]
    );
    res.json({ message: 'Grievance submitted successfully' });
  } catch (err) {
    console.error('Submit grievance error:', err.message);
    res.status(500).json({ error: 'Failed to submit grievance', details: err.message });
  }
});

router.get('/my', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM grievances WHERE student_id=? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows || []);
  } catch (err) {
    console.error('Get my grievances error:', err.message);
    res.status(500).json({ error: 'Failed to fetch grievances', details: err.message });
  }
});

router.get('/history/:id', verifyToken, async (req, res) => {
  try {
    const grievanceId = req.params.id;
    const [grievances] = await pool.query(
      'SELECT id FROM grievances WHERE id=? AND student_id=?',
      [grievanceId, req.user.id]
    );
    if (!grievances || grievances.length === 0) return res.status(404).json({ error: 'Grievance not found' });

    const [history] = await pool.query(
      'SELECT status, admin_remark, assigned_department, changed_at FROM grievance_status_history WHERE grievance_id=? ORDER BY changed_at ASC',
      [grievanceId]
    );
    res.json(history || []);
  } catch (err) {
    console.error('Get grievance history error:', err.message);
    res.status(500).json({ error: 'Failed to fetch history', details: err.message });
  }
});

module.exports = router;
