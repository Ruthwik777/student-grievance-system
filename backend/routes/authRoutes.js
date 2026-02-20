const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const verifyToken = require('../middleware/verifyToken');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', 
      [name, email, hash, 'student']);
    
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Register error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address' });
    
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows || rows.length === 0) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign(
      { id: rows[0].id, role: rows[0].role },
      process.env.JWT_SECRET || 'secretkey'
    );
    res.json({ token, role: rows[0].role });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Admin Registration (with secret key for security)
router.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    const ADMIN_SECRET = 'admin@secure2024'; // Change this to your secret key
    
    if (!adminSecret || adminSecret !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid admin secret key' });
    }
    
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', 
      [name, email, hash, 'admin']);
    
    res.json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Admin register error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Admin registration failed', details: err.message });
  }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address' });
    
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows || rows.length === 0) return res.status(400).json({ error: 'User not found' });

    if (rows[0].role !== 'admin') return res.status(403).json({ error: 'Not an admin' });

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign(
      { id: rows[0].id, role: rows[0].role },
      process.env.JWT_SECRET || 'secretkey'
    );
    res.json({ token, role: rows[0].role });
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ error: 'Admin login failed', details: err.message });
  }
});

// Forgot Password - Send Reset Token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address' });
    
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows || rows.length === 0) return res.status(400).json({ error: 'User not found' });
    
    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: rows[0].id, email: rows[0].email },
      process.env.RESET_SECRET || 'reset-secret',
      { expiresIn: '1h' }
    );
    
    // Store reset token in database
    await pool.query('UPDATE users SET reset_token=? WHERE id=?', [resetToken, rows[0].id]);
    
    // For now, return token in response (in production, send via email)
    res.json({ 
      message: 'Password reset token generated',
      token: resetToken,
      note: 'In production, this would be sent via email'
    });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Failed to process forgot password', details: err.message });
  }
});

// Reset Password - Verify Token and Update Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_SECRET || 'reset-secret');
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Check if token matches in database
    const [rows] = await pool.query('SELECT * FROM users WHERE id=? AND reset_token=?', [decoded.id, token]);
    if (!rows || rows.length === 0) return res.status(400).json({ error: 'Token not found or expired' });
    
    // Hash new password and update
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash=?, reset_token=NULL WHERE id=?', [hash, decoded.id]);
    
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ error: 'Failed to reset password', details: err.message });
  }
});

// Update Profile
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name && !password) return res.status(400).json({ error: 'Nothing to update' });

    if (name && password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET name=?, password_hash=? WHERE id=?', [name, hash, req.user.id]);
    } else if (name) {
      await pool.query('UPDATE users SET name=? WHERE id=?', [name, req.user.id]);
    } else {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password_hash=? WHERE id=?', [hash, req.user.id]);
    }

    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Update profile error:', err.message);
      res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

module.exports = router;
