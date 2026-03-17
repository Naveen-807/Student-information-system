const pool = require('../config/database');

exports.getDashboard = async (req, res) => {
  try {
    const studentResult = await pool.query(
      'SELECT * FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    
    const student = studentResult.rows[0];
    
    // Get enrolled courses count
    const coursesResult = await pool.query(
      'SELECT COUNT(*) FROM enrollments WHERE student_id = $1 AND status = $2',
      [student.id, 'active']
    );
    
    // Get attendance percentage
    const attendanceResult = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'present') as present,
        COUNT(*) as total
       FROM attendance WHERE student_id = $1`,
      [student.id]
    );
    
    const attendanceData = attendanceResult.rows[0];
    const attendancePercentage = attendanceData.total > 0 
      ? ((attendanceData.present / attendanceData.total) * 100).toFixed(2)
      : 0;
    
    // Get pending assignments
    const assignmentsResult = await pool.query(
      `SELECT COUNT(*) FROM assignments a
       INNER JOIN enrollments e ON a.course_id = e.course_id
       LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = $1
       WHERE e.student_id = $1 AND e.status = 'active' 
       AND s.id IS NULL AND a.due_date > NOW()`,
      [student.id]
    );
    
    // Get pending fees
    const feesResult = await pool.query(
      `SELECT SUM(amount - paid_amount) as pending FROM fees 
       WHERE student_id = $1 AND status != 'paid'`,
      [student.id]
    );
    
    res.json({
      student,
      stats: {
        enrolledCourses: parseInt(coursesResult.rows[0].count),
        attendancePercentage: parseFloat(attendancePercentage),
        pendingAssignments: parseInt(assignmentsResult.rows[0].count),
        pendingFees: parseFloat(feesResult.rows[0].pending || 0),
        gpa: parseFloat(student.gpa)
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    const studentId = studentResult.rows[0].id;
    
    const result = await pool.query(
      `SELECT c.*, e.status as enrollment_status, e.grade,
        t.first_name || ' ' || t.last_name as teacher_name,
        d.name as department_name
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id AND e.student_id = $1
       LEFT JOIN teachers t ON c.teacher_id = t.id
       LEFT JOIN departments d ON c.department_id = d.id
       ORDER BY c.name`,
      [studentId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    const studentId = studentResult.rows[0].id;
    
    // Check if already enrolled
    const existing = await pool.query(
      'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [studentId, courseId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    // Check course capacity
    const courseResult = await pool.query(
      `SELECT c.capacity, COUNT(e.id) as enrolled
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
       WHERE c.id = $1
       GROUP BY c.id, c.capacity`,
      [courseId]
    );
    
    const course = courseResult.rows[0];
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ error: 'Course is full' });
    }
    
    await pool.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)',
      [studentId, courseId]
    );
    
    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.dropCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    await pool.query(
      'UPDATE enrollments SET status = $1 WHERE student_id = $2 AND course_id = $3',
      ['dropped', studentResult.rows[0].id, courseId]
    );
    
    res.json({ message: 'Course dropped successfully' });
  } catch (error) {
    console.error('Drop course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    const result = await pool.query(
      `SELECT a.*, c.name as course_name, c.course_code
       FROM attendance a
       INNER JOIN courses c ON a.course_id = c.id
       WHERE a.student_id = $1
       ORDER BY a.date DESC`,
      [studentResult.rows[0].id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    const result = await pool.query(
      `SELECT g.*, c.name as course_name, c.course_code, c.credits
       FROM grades g
       INNER JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = $1
       ORDER BY g.created_at DESC`,
      [studentResult.rows[0].id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    const result = await pool.query(
      `SELECT a.*, c.name as course_name, c.course_code,
        s.id as submission_id, s.submitted_at, s.marks_obtained, s.feedback
       FROM assignments a
       INNER JOIN enrollments e ON a.course_id = e.course_id
       INNER JOIN courses c ON a.course_id = c.id
       LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = $1
       WHERE e.student_id = $1 AND e.status = 'active'
       ORDER BY a.due_date DESC`,
      [studentResult.rows[0].id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionText, fileUrl } = req.body;
    
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    await pool.query(
      `INSERT INTO submissions (assignment_id, student_id, submission_text, file_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (assignment_id, student_id) 
       DO UPDATE SET submission_text = $3, file_url = $4, submitted_at = NOW()`,
      [id, studentResult.rows[0].id, submissionText, fileUrl]
    );
    
    res.json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFees = async (req, res) => {
  try {
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    const result = await pool.query(
      `SELECT f.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'amount', p.amount,
              'payment_date', p.payment_date,
              'transaction_id', p.transaction_id
            )
          ) FILTER (WHERE p.id IS NOT NULL), '[]'
        ) as payments
       FROM fees f
       LEFT JOIN payments p ON f.id = p.fee_id
       WHERE f.student_id = $1
       GROUP BY f.id
       ORDER BY f.due_date DESC`,
      [studentResult.rows[0].id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    
    const result = await pool.query(
      `SELECT t.*, c.name as course_name, c.course_code,
        te.first_name || ' ' || te.last_name as teacher_name
       FROM timetable t
       INNER JOIN courses c ON t.course_id = c.id
       INNER JOIN enrollments e ON c.id = e.course_id
       LEFT JOIN teachers te ON c.teacher_id = te.id
       WHERE e.student_id = $1 AND e.status = 'active'
       ORDER BY t.day_of_week, t.start_time`,
      [studentResult.rows[0].id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
