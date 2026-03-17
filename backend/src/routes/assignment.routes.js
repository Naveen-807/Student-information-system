const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const pool = require('../config/database');

router.use(auth);

router.get('/course/:courseId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, c.name as course_name,
        t.first_name || ' ' || t.last_name as created_by_name
       FROM assignments a
       INNER JOIN courses c ON a.course_id = c.id
       LEFT JOIN teachers t ON a.created_by = t.id
       WHERE a.course_id = $1
       ORDER BY a.due_date DESC`,
      [req.params.courseId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
