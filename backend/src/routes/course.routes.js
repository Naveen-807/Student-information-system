const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const pool = require('../config/database');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, d.name as department_name,
        t.first_name || ' ' || t.last_name as teacher_name
       FROM courses c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN teachers t ON c.teacher_id = t.id
       ORDER BY c.name`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, d.name as department_name,
        t.first_name || ' ' || t.last_name as teacher_name
       FROM courses c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN teachers t ON c.teacher_id = t.id
       WHERE c.id = $1`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/materials', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sm.*, t.first_name || ' ' || t.last_name as uploaded_by_name
       FROM study_materials sm
       LEFT JOIN teachers t ON sm.uploaded_by = t.id
       WHERE sm.course_id = $1
       ORDER BY sm.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
