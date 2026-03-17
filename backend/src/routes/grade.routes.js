const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const pool = require('../config/database');

router.use(auth);

router.get('/course/:courseId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.*, s.first_name, s.last_name, s.student_id
       FROM grades g
       INNER JOIN students s ON g.student_id = s.id
       WHERE g.course_id = $1
       ORDER BY s.last_name, s.first_name`,
      [req.params.courseId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
