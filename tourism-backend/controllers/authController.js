const db     = require('../config/db');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

// POST /api/auth/register
exports.register = async (req, res) => {
  const { full_name, email, password, phone } = req.body;
  try {
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (full_name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
      [full_name, email, hash, phone]
    );
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ token, user: { user_id: user.user_id, full_name: user.full_name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/auth/profile  (protected)
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT user_id, full_name, email, phone, role, created_at FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/auth/profile  (protected)
exports.updateProfile = async (req, res) => {
  const { full_name, phone } = req.body;
  try {
    await db.query(
      'UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?',
      [full_name, phone, req.user.user_id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};