const pool = require('../config/database');
const bcrypt = require('bcryptjs');

exports.getDashboard = async (req, res) => {
  try {
    const studentsCount = await pool.query('SELECT COUNT(*) FROM students');
    const teachersCount = await pool.query('SELECT COUNT(*) FROM teachers');
    const coursesCount = await pool.query('SELECT COUNT(*) FROM courses');
    const departmentsCount = await pool.query('SELECT COUNT(*) FROM departments');
    
    res.json({
      totalStudents: parseInt(studentsCount.rows[0].count),
      totalTeachers: parseInt(teachersCount.rows[0].count),
      totalCourses: parseInt(coursesCount.rows[0].count),
      totalDepartments: parseInt(departmentsCount.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.email, u.is_active, d.name as department_name
       FROM students s
       INNER JOIN users u ON s.user_id = u.id
       LEFT JOIN departments d ON s.department_id = d.id
       ORDER BY s.last_name, s.first_name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { email, password, studentId, firstName, lastName, dateOfBirth, gender, phone, address, departmentId, semester, year } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userResult = await client.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, 'student']
    );
    
    const studentResult = await client.query(
      `INSERT INTO students (user_id, student_id, first_name, last_name, date_of_birth, gender, phone, address, department_id, semester, year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [userResult.rows[0].id, studentId, firstName, lastName, dateOfBirth, gender, phone, address, departmentId, semester, year]
    );
    
    await client.query('COMMIT');
    res.status(201).json(studentResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, address, departmentId, semester, year, gpa } = req.body;
    
    const result = await pool.query(
      `UPDATE students 
       SET first_name = $1, last_name = $2, phone = $3, address = $4, 
           department_id = $5, semester = $6, year = $7, gpa = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [firstName, lastName, phone, address, departmentId, semester, year, gpa, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.email, u.is_active, d.name as department_name
       FROM teachers t
       INNER JOIN users u ON t.user_id = u.id
       LEFT JOIN departments d ON t.department_id = d.id
       ORDER BY t.last_name, t.first_name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createTeacher = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { email, password, teacherId, firstName, lastName, phone, departmentId, specialization, qualification } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userResult = await client.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, 'teacher']
    );
    
    const teacherResult = await client.query(
      `INSERT INTO teachers (user_id, teacher_id, first_name, last_name, phone, department_id, specialization, qualification)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userResult.rows[0].id, teacherId, firstName, lastName, phone, departmentId, specialization, qualification]
    );
    
    await client.query('COMMIT');
    res.status(201).json(teacherResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, departmentId, specialization, qualification } = req.body;
    
    const result = await pool.query(
      `UPDATE teachers 
       SET first_name = $1, last_name = $2, phone = $3, department_id = $4, 
           specialization = $5, qualification = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [firstName, lastName, phone, departmentId, specialization, qualification, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM teachers WHERE id = $1', [id]);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, d.name as department_name,
        t.first_name || ' ' || t.last_name as teacher_name,
        COUNT(e.id) as enrolled_count
       FROM courses c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN teachers t ON c.teacher_id = t.id
       LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
       GROUP BY c.id, d.name, t.first_name, t.last_name
       ORDER BY c.name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { courseCode, name, description, credits, departmentId, semester, capacity, teacherId } = req.body;
    
    const result = await pool.query(
      `INSERT INTO courses (course_code, name, description, credits, department_id, semester, capacity, teacher_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [courseCode, name, description, credits, departmentId, semester, capacity, teacherId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, credits, departmentId, semester, capacity, teacherId } = req.body;
    
    const result = await pool.query(
      `UPDATE courses 
       SET name = $1, description = $2, credits = $3, department_id = $4, 
           semester = $5, capacity = $6, teacher_id = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [name, description, credits, departmentId, semester, capacity, teacherId, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, t.first_name || ' ' || t.last_name as head_name,
        COUNT(DISTINCT s.id) as student_count,
        COUNT(DISTINCT c.id) as course_count
       FROM departments d
       LEFT JOIN teachers t ON d.head_teacher_id = t.id
       LEFT JOIN students s ON d.id = s.department_id
       LEFT JOIN courses c ON d.id = c.department_id
       GROUP BY d.id, t.first_name, t.last_name
       ORDER BY d.name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, headTeacherId } = req.body;
    
    const result = await pool.query(
      `INSERT INTO departments (name, code, description, head_teacher_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, code, description, headTeacherId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, 
        s.first_name || ' ' || s.last_name as student_name,
        s.student_id,
        c.name as course_name,
        c.course_code
       FROM enrollments e
       INNER JOIN students s ON e.student_id = s.id
       INNER JOIN courses c ON e.course_id = c.id
       ORDER BY e.enrollment_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    const result = await pool.query(
      `INSERT INTO enrollments (student_id, course_id)
       VALUES ($1, $2)
       RETURNING *`,
      [studentId, courseId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSystemAnalytics = async (req, res) => {
  try {
    const enrollmentTrends = await pool.query(
      `SELECT DATE_TRUNC('month', enrollment_date) as month, COUNT(*) as count
       FROM enrollments
       WHERE enrollment_date >= NOW() - INTERVAL '6 months'
       GROUP BY month
       ORDER BY month`
    );
    
    const departmentStats = await pool.query(
      `SELECT d.name, COUNT(s.id) as student_count
       FROM departments d
       LEFT JOIN students s ON d.id = s.department_id
       GROUP BY d.id, d.name
       ORDER BY student_count DESC`
    );
    
    const gpaDistribution = await pool.query(
      `SELECT 
        CASE 
          WHEN gpa >= 3.5 THEN 'A'
          WHEN gpa >= 3.0 THEN 'B'
          WHEN gpa >= 2.5 THEN 'C'
          WHEN gpa >= 2.0 THEN 'D'
          ELSE 'F'
        END as grade,
        COUNT(*) as count
       FROM students
       WHERE gpa > 0
       GROUP BY grade
       ORDER BY grade`
    );
    
    res.json({
      enrollmentTrends: enrollmentTrends.rows,
      departmentStats: departmentStats.rows,
      gpaDistribution: gpaDistribution.rows
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
