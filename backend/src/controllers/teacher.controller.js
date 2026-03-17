const pool = require('../config/database');

exports.getDashboard = async (req, res) => {
  try {
    const teacherResult = await pool.query(
      'SELECT * FROM teachers WHERE user_id = $1',
      [req.user.id]
    );
    
    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const teacher = teacherResult.rows[0];
    
    const coursesResult = await pool.query(
      'SELECT COUNT(*) FROM courses WHERE teacher_id = $1',
      [teacher.id]
    );
    
    const studentsResult = await pool.query(
      `SELECT COUNT(DISTINCT e.student_id) FROM enrollments e
       INNER JOIN courses c ON e.course_id = c.id
       WHERE c.teacher_id = $1 AND e.status = 'active'`,
      [teacher.id]
    );
    
    const assignmentsResult = await pool.query(
      `SELECT COUNT(*) FROM assignments a
       INNER JOIN courses c ON a.course_id = c.id
       WHERE c.teacher_id = $1`,
      [teacher.id]
    );
    
    const pendingGradingResult = await pool.query(
      `SELECT COUNT(*) FROM submissions s
       INNER JOIN assignments a ON s.assignment_id = a.id
       INNER JOIN courses c ON a.course_id = c.id
       WHERE c.teacher_id = $1 AND s.marks_obtained IS NULL`,
      [teacher.id]
    );
    
    res.json({
      teacher,
      stats: {
        totalCourses: parseInt(coursesResult.rows[0].count),
        totalStudents: parseInt(studentsResult.rows[0].count),
        totalAssignments: parseInt(assignmentsResult.rows[0].count),
        pendingGrading: parseInt(pendingGradingResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [req.user.id]
    );
    
    const result = await pool.query(
      `SELECT c.*, d.name as department_name,
        COUNT(DISTINCT e.student_id) as enrolled_students
       FROM courses c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
       WHERE c.teacher_id = $1
       GROUP BY c.id, d.name
       ORDER BY c.name`,
      [teacherResult.rows[0].id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const result = await pool.query(
      `SELECT s.*, u.email, e.enrollment_date, e.grade
       FROM students s
       INNER JOIN enrollments e ON s.id = e.student_id
       INNER JOIN users u ON s.user_id = u.id
       WHERE e.course_id = $1 AND e.status = 'active'
       ORDER BY s.last_name, s.first_name`,
      [courseId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get course students error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, attendanceRecords } = req.body;
    
    const teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [req.user.id]
    );
    
    const teacherId = teacherResult.rows[0].id;
    
    for (const record of attendanceRecords) {
      await pool.query(
        `INSERT INTO attendance (student_id, course_id, date, status, marked_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id, course_id, date)
         DO UPDATE SET status = $4, marked_by = $5`,
        [record.studentId, courseId, date, record.status, teacherId]
      );
    }
    
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate, totalMarks, fileUrl } = req.body;
    
    const teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [req.user.id]
    );
    
    const result = await pool.query(
      `INSERT INTO assignments (course_id, title, description, due_date, total_marks, file_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [courseId, title, description, dueDate, totalMarks, fileUrl, teacherResult.rows[0].id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const result = await pool.query(
      `SELECT s.*, st.first_name, st.last_name, st.student_id, u.email
       FROM submissions s
       INNER JOIN students st ON s.student_id = st.id
       INNER JOIN users u ON st.user_id = u.id
       WHERE s.assignment_id = $1
       ORDER BY s.submitted_at DESC`,
      [assignmentId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksObtained, feedback } = req.body;
    
    const teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [req.user.id]
    );
    
    await pool.query(
      `UPDATE submissions 
       SET marks_obtained = $1, feedback = $2, graded_by = $3, graded_at = NOW()
       WHERE id = $4`,
      [marksObtained, feedback, teacherResult.rows[0].id, submissionId]
    );
    
    res.json({ message: 'Submission graded successfully' });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.uploadMaterial = async (req, res) => {
  try {
    const { courseId, title, description, fileUrl, fileType } = req.body;
    
    const teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [req.user.id]
    );
    
    const result = await pool.query(
      `INSERT INTO study_materials (course_id, title, description, file_url, file_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [courseId, title, description, fileUrl, fileType, teacherResult.rows[0].id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Upload material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const attendanceStats = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'present') * 100.0 / NULLIF(COUNT(*), 0) as avg_attendance
       FROM attendance
       WHERE course_id = $1`,
      [courseId]
    );
    
    const gradeDistribution = await pool.query(
      `SELECT grade, COUNT(*) as count
       FROM enrollments
       WHERE course_id = $1 AND grade IS NOT NULL
       GROUP BY grade
       ORDER BY grade`,
      [courseId]
    );
    
    const submissionStats = await pool.query(
      `SELECT 
        COUNT(*) as total_assignments,
        COUNT(DISTINCT s.student_id) as students_submitted,
        AVG(s.marks_obtained) as avg_marks
       FROM assignments a
       LEFT JOIN submissions s ON a.id = s.assignment_id
       WHERE a.course_id = $1`,
      [courseId]
    );
    
    res.json({
      attendance: attendanceStats.rows[0],
      gradeDistribution: gradeDistribution.rows,
      submissions: submissionStats.rows[0]
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
