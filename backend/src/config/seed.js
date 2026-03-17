require('dotenv').config();
const pool = require('./database');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Seeding database...');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const adminResult = await client.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['admin@university.edu', adminPassword, 'admin']
    );
    
    console.log('✅ Admin user created');
    
    // Create departments
    const deptResult = await client.query(
      `INSERT INTO departments (name, code, description) 
       VALUES 
       ('Computer Science', 'CS', 'Department of Computer Science and Engineering'),
       ('Mathematics', 'MATH', 'Department of Mathematics'),
       ('Physics', 'PHY', 'Department of Physics'),
       ('Business Administration', 'BUS', 'Department of Business Administration')
       ON CONFLICT (code) DO NOTHING
       RETURNING id`
    );
    
    console.log('✅ Departments created');
    
    // Create sample teacher
    const teacherPassword = await bcrypt.hash('Teacher@123', 10);
    const teacherUserResult = await client.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['teacher@university.edu', teacherPassword, 'teacher']
    );
    
    if (teacherUserResult.rows.length > 0) {
      await client.query(
        `INSERT INTO teachers (user_id, teacher_id, first_name, last_name, phone, department_id, specialization, qualification)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (user_id) DO NOTHING`,
        [teacherUserResult.rows[0].id, 'T001', 'John', 'Smith', '555-0101', 1, 'Data Structures', 'PhD in Computer Science']
      );
    }
    
    console.log('✅ Sample teacher created');
    
    // Create sample student
    const studentPassword = await bcrypt.hash('Student@123', 10);
    const studentUserResult = await client.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['student@university.edu', studentPassword, 'student']
    );
    
    if (studentUserResult.rows.length > 0) {
      await client.query(
        `INSERT INTO students (user_id, student_id, first_name, last_name, date_of_birth, gender, phone, department_id, semester, year, gpa)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (user_id) DO NOTHING`,
        [studentUserResult.rows[0].id, 'S001', 'Jane', 'Doe', '2002-05-15', 'Female', '555-0102', 1, 3, 2024, 3.75]
      );
    }
    
    console.log('✅ Sample student created');
    
    // Create sample courses
    const teacherId = await client.query('SELECT id FROM teachers LIMIT 1');
    if (teacherId.rows.length > 0) {
      await client.query(
        `INSERT INTO courses (course_code, name, description, credits, department_id, semester, capacity, teacher_id)
         VALUES 
         ('CS101', 'Introduction to Programming', 'Basic programming concepts using Python', 3, 1, 1, 50, $1),
         ('CS201', 'Data Structures', 'Fundamental data structures and algorithms', 4, 1, 3, 40, $1),
         ('CS301', 'Database Systems', 'Relational databases and SQL', 3, 1, 5, 35, $1),
         ('MATH101', 'Calculus I', 'Differential and integral calculus', 4, 2, 1, 60, NULL)
         ON CONFLICT (course_code) DO NOTHING`,
        [teacherId.rows[0].id]
      );
    }
    
    console.log('✅ Sample courses created');
    
    await client.query('COMMIT');
    
    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Default credentials:');
    console.log('Admin: admin@university.edu / Admin@123');
    console.log('Teacher: teacher@university.edu / Teacher@123');
    console.log('Student: student@university.edu / Student@123\n');
    
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

seed();
