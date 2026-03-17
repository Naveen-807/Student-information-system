const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const pool = require('../config/database');

router.use(auth);

router.get('/course/:courseId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, s.first_name, s.last_name, s.student_id
       FROM attendance a
       INNER JOIN students s ON a.student_id = s.id
       WHERE a.course_id = $1
       ORDER BY a.date DESC, s.last_name`,
      [req.params.courseId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
