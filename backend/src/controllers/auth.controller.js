const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/database');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get role-specific data
    let profileData = {};
    if (user.role === 'student') {
      const studentResult = await pool.query(
        'SELECT * FROM students WHERE user_id = $1',
        [user.id]
      );
      profileData = studentResult.rows[0] || {};
    } else if (user.role === 'teacher') {
      const teacherResult = await pool.query(
        'SELECT * FROM teachers WHERE user_id = $1',
        [user.id]
      );
      profileData = teacherResult.rows[0] || {};
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...profileData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    let profileData = {};

    if (user.role === 'student') {
      const result = await pool.query(
        'SELECT s.*, d.name as department_name FROM students s LEFT JOIN departments d ON s.department_id = d.id WHERE s.user_id = $1',
        [user.id]
      );
      profileData = result.rows[0] || {};
    } else if (user.role === 'teacher') {
      const result = await pool.query(
        'SELECT t.*, d.name as department_name FROM teachers t LEFT JOIN departments d ON t.department_id = d.id WHERE t.user_id = $1',
        [user.id]
      );
      profileData = result.rows[0] || {};
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      ...profileData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Implementation for password reset email
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    // Implementation for password reset
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
