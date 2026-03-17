const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const studentController = require('../controllers/student.controller');

router.use(auth);

router.get('/dashboard', authorize('student'), studentController.getDashboard);
router.get('/courses', authorize('student'), studentController.getCourses);
router.post('/courses/enroll', authorize('student'), studentController.enrollCourse);
router.delete('/courses/:courseId/drop', authorize('student'), studentController.dropCourse);
router.get('/attendance', authorize('student'), studentController.getAttendance);
router.get('/grades', authorize('student'), studentController.getGrades);
router.get('/assignments', authorize('student'), studentController.getAssignments);
router.post('/assignments/:id/submit', authorize('student'), studentController.submitAssignment);
router.get('/fees', authorize('student'), studentController.getFees);
router.get('/timetable', authorize('student'), studentController.getTimetable);

module.exports = router;
