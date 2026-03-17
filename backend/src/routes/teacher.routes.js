const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const teacherController = require('../controllers/teacher.controller');

router.use(auth);

router.get('/dashboard', authorize('teacher'), teacherController.getDashboard);
router.get('/courses', authorize('teacher'), teacherController.getCourses);
router.get('/courses/:courseId/students', authorize('teacher'), teacherController.getCourseStudents);
router.post('/attendance', authorize('teacher'), teacherController.markAttendance);
router.post('/assignments', authorize('teacher'), teacherController.createAssignment);
router.get('/assignments/:assignmentId/submissions', authorize('teacher'), teacherController.getSubmissions);
router.put('/submissions/:submissionId/grade', authorize('teacher'), teacherController.gradeSubmission);
router.post('/materials', authorize('teacher'), teacherController.uploadMaterial);
router.get('/courses/:courseId/analytics', authorize('teacher'), teacherController.getAnalytics);

module.exports = router;
