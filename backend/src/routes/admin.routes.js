const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

router.use(auth, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/students', adminController.getStudents);
router.post('/students', adminController.createStudent);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);
router.get('/teachers', adminController.getTeachers);
router.post('/teachers', adminController.createTeacher);
router.put('/teachers/:id', adminController.updateTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);
router.get('/courses', adminController.getCourses);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);
router.get('/enrollments', adminController.getEnrollments);
router.post('/enrollments', adminController.createEnrollment);
router.get('/analytics', adminController.getSystemAnalytics);

module.exports = router;
