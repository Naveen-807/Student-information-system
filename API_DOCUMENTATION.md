# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### POST /auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "Student@123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@university.edu",
    "role": "student",
    "first_name": "Jane",
    "last_name": "Doe",
    "student_id": "S001"
  }
}
```

### POST /auth/register

Register a new user.

**Request Body:**
```json
{
  "email": "newuser@university.edu",
  "password": "SecurePass123",
  "role": "student"
}
```

### GET /auth/me

Get current user profile (requires authentication).

**Response:**
```json
{
  "id": 1,
  "email": "student@university.edu",
  "role": "student",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

## Student Endpoints

All student endpoints require authentication with `student` role.

### GET /students/dashboard

Get student dashboard data.

**Response:**
```json
{
  "student": {
    "id": 1,
    "student_id": "S001",
    "first_name": "Jane",
    "last_name": "Doe",
    "semester": 3,
    "year": 2024,
    "gpa": 3.75
  },
  "stats": {
    "enrolledCourses": 5,
    "attendancePercentage": 92.5,
    "pendingAssignments": 3,
    "pendingFees": 1500.00,
    "gpa": 3.75
  }
}
```

### GET /students/courses

Get all courses (enrolled and available).

**Response:**
```json
[
  {
    "id": 1,
    "course_code": "CS101",
    "name": "Introduction to Programming",
    "description": "Basic programming concepts",
    "credits": 3,
    "teacher_name": "John Smith",
    "enrollment_status": "active",
    "grade": null
  }
]
```

### POST /students/courses/enroll

Enroll in a course.

**Request Body:**
```json
{
  "courseId": 1
}
```

### DELETE /students/courses/:courseId/drop

Drop a course.

### GET /students/attendance

Get attendance records.

**Response:**
```json
[
  {
    "id": 1,
    "course_name": "Introduction to Programming",
    "course_code": "CS101",
    "date": "2024-03-15",
    "status": "present"
  }
]
```

### GET /students/grades

Get grade records.

**Response:**
```json
[
  {
    "id": 1,
    "course_name": "Data Structures",
    "course_code": "CS201",
    "exam_type": "midterm",
    "marks_obtained": 85,
    "total_marks": 100,
    "grade": "A",
    "semester": 3,
    "year": 2024
  }
]
```

### GET /students/assignments

Get all assignments.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Programming Assignment 1",
    "description": "Implement sorting algorithms",
    "course_name": "Data Structures",
    "course_code": "CS201",
    "due_date": "2024-03-20T23:59:59Z",
    "total_marks": 100,
    "submission_id": null,
    "submitted_at": null,
    "marks_obtained": null,
    "feedback": null
  }
]
```

### POST /students/assignments/:id/submit

Submit an assignment.

**Request Body:**
```json
{
  "submissionText": "Assignment solution...",
  "fileUrl": "https://s3.amazonaws.com/..."
}
```

### GET /students/fees

Get fee records.

**Response:**
```json
[
  {
    "id": 1,
    "semester": 3,
    "year": 2024,
    "amount": 5000.00,
    "paid_amount": 3500.00,
    "due_date": "2024-04-01",
    "status": "partial",
    "payments": [
      {
        "id": 1,
        "amount": 3500.00,
        "payment_date": "2024-03-01",
        "transaction_id": "TXN123456"
      }
    ]
  }
]
```

### GET /students/timetable

Get weekly timetable.

**Response:**
```json
[
  {
    "id": 1,
    "course_name": "Data Structures",
    "course_code": "CS201",
    "day_of_week": 1,
    "start_time": "09:00:00",
    "end_time": "10:30:00",
    "room": "Room 101",
    "teacher_name": "John Smith"
  }
]
```

## Teacher Endpoints

All teacher endpoints require authentication with `teacher` role.

### GET /teachers/dashboard

Get teacher dashboard data.

**Response:**
```json
{
  "teacher": {
    "id": 1,
    "teacher_id": "T001",
    "first_name": "John",
    "last_name": "Smith",
    "specialization": "Data Structures",
    "qualification": "PhD in Computer Science"
  },
  "stats": {
    "totalCourses": 3,
    "totalStudents": 120,
    "totalAssignments": 15,
    "pendingGrading": 25
  }
}
```

### GET /teachers/courses

Get assigned courses.

**Response:**
```json
[
  {
    "id": 1,
    "course_code": "CS201",
    "name": "Data Structures",
    "description": "Fundamental data structures",
    "credits": 4,
    "semester": 3,
    "capacity": 40,
    "enrolled_students": 35,
    "department_name": "Computer Science"
  }
]
```

### GET /teachers/courses/:courseId/students

Get students enrolled in a course.

**Response:**
```json
[
  {
    "id": 1,
    "student_id": "S001",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@university.edu",
    "enrollment_date": "2024-01-15",
    "grade": null
  }
]
```

### POST /teachers/attendance

Mark attendance for students.

**Request Body:**
```json
{
  "courseId": 1,
  "date": "2024-03-15",
  "attendanceRecords": [
    {
      "studentId": 1,
      "status": "present"
    },
    {
      "studentId": 2,
      "status": "absent"
    }
  ]
}
```

### POST /teachers/assignments

Create a new assignment.

**Request Body:**
```json
{
  "courseId": 1,
  "title": "Programming Assignment 1",
  "description": "Implement sorting algorithms",
  "dueDate": "2024-03-20T23:59:59Z",
  "totalMarks": 100,
  "fileUrl": "https://s3.amazonaws.com/..."
}
```

### GET /teachers/assignments/:assignmentId/submissions

Get submissions for an assignment.

**Response:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "first_name": "Jane",
    "last_name": "Doe",
    "student_id": "S001",
    "email": "jane@university.edu",
    "submission_text": "Solution...",
    "file_url": "https://s3.amazonaws.com/...",
    "submitted_at": "2024-03-18T10:30:00Z",
    "marks_obtained": null,
    "feedback": null
  }
]
```

### PUT /teachers/submissions/:submissionId/grade

Grade a submission.

**Request Body:**
```json
{
  "marksObtained": 85,
  "feedback": "Good work! Consider optimizing the algorithm."
}
```

### POST /teachers/materials

Upload study material.

**Request Body:**
```json
{
  "courseId": 1,
  "title": "Lecture Notes - Week 1",
  "description": "Introduction to data structures",
  "fileUrl": "https://s3.amazonaws.com/...",
  "fileType": "pdf"
}
```

### GET /teachers/courses/:courseId/analytics

Get course analytics.

**Response:**
```json
{
  "attendance": {
    "avg_attendance": 87.5
  },
  "gradeDistribution": [
    { "grade": "A", "count": 10 },
    { "grade": "B", "count": 15 },
    { "grade": "C", "count": 8 }
  ],
  "submissions": {
    "total_assignments": 5,
    "students_submitted": 32,
    "avg_marks": 78.5
  }
}
```

## Admin Endpoints

All admin endpoints require authentication with `admin` role.

### GET /admin/dashboard

Get admin dashboard statistics.

**Response:**
```json
{
  "totalStudents": 500,
  "totalTeachers": 50,
  "totalCourses": 100,
  "totalDepartments": 5
}
```

### GET /admin/students

Get all students.

**Response:**
```json
[
  {
    "id": 1,
    "student_id": "S001",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@university.edu",
    "department_name": "Computer Science",
    "semester": 3,
    "gpa": 3.75,
    "is_active": true
  }
]
```

### POST /admin/students

Create a new student.

**Request Body:**
```json
{
  "email": "newstudent@university.edu",
  "password": "SecurePass123",
  "studentId": "S999",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2002-05-15",
  "gender": "Male",
  "phone": "555-0123",
  "address": "123 Main St",
  "departmentId": 1,
  "semester": 1,
  "year": 2024
}
```

### PUT /admin/students/:id

Update student information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-0123",
  "address": "123 Main St",
  "departmentId": 1,
  "semester": 2,
  "year": 2024,
  "gpa": 3.5
}
```

### DELETE /admin/students/:id

Delete a student.

### GET /admin/teachers

Get all teachers.

### POST /admin/teachers

Create a new teacher.

**Request Body:**
```json
{
  "email": "newteacher@university.edu",
  "password": "SecurePass123",
  "teacherId": "T999",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "phone": "555-0456",
  "departmentId": 1,
  "specialization": "Machine Learning",
  "qualification": "PhD in Computer Science"
}
```

### PUT /admin/teachers/:id

Update teacher information.

### DELETE /admin/teachers/:id

Delete a teacher.

### GET /admin/courses

Get all courses.

**Response:**
```json
[
  {
    "id": 1,
    "course_code": "CS101",
    "name": "Introduction to Programming",
    "description": "Basic programming concepts",
    "credits": 3,
    "department_name": "Computer Science",
    "semester": 1,
    "capacity": 50,
    "teacher_name": "John Smith",
    "enrolled_count": 45
  }
]
```

### POST /admin/courses

Create a new course.

**Request Body:**
```json
{
  "courseCode": "CS999",
  "name": "Advanced Topics",
  "description": "Advanced computer science topics",
  "credits": 3,
  "departmentId": 1,
  "semester": 7,
  "capacity": 30,
  "teacherId": 1
}
```

### PUT /admin/courses/:id

Update course information.

### DELETE /admin/courses/:id

Delete a course.

### GET /admin/departments

Get all departments.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Computer Science",
    "code": "CS",
    "description": "Department of Computer Science",
    "head_name": "John Smith",
    "student_count": 200,
    "course_count": 25
  }
]
```

### POST /admin/departments

Create a new department.

**Request Body:**
```json
{
  "name": "Data Science",
  "code": "DS",
  "description": "Department of Data Science",
  "headTeacherId": 1
}
```

### GET /admin/enrollments

Get all enrollments.

### POST /admin/enrollments

Create a new enrollment.

**Request Body:**
```json
{
  "studentId": 1,
  "courseId": 1
}
```

### GET /admin/analytics

Get system analytics.

**Response:**
```json
{
  "enrollmentTrends": [
    { "month": "2024-01-01", "count": 150 },
    { "month": "2024-02-01", "count": 180 }
  ],
  "departmentStats": [
    { "name": "Computer Science", "student_count": 200 },
    { "name": "Mathematics", "student_count": 150 }
  ],
  "gpaDistribution": [
    { "grade": "A", "count": 50 },
    { "grade": "B", "count": 80 }
  ]
}
```

## Common Endpoints

### GET /courses

Get all courses (accessible to all authenticated users).

### GET /courses/:id

Get course details.

### GET /courses/:id/materials

Get study materials for a course.

### GET /notifications

Get user notifications.

### PUT /notifications/:id/read

Mark notification as read.

### PUT /notifications/read-all

Mark all notifications as read.

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

When rate limit is exceeded:
```json
{
  "error": "Too many requests, please try again later"
}
```

## Pagination

Endpoints that return lists support pagination (to be implemented):

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```
