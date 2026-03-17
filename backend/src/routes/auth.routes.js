const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');

router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['student', 'teacher', 'admin'])
  ],
  authController.register
);

router.post('/logout', auth, authController.logout);

router.get('/me', auth, authController.getProfile);

router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  authController.forgotPassword
);

router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 })
  ],
  authController.resetPassword
);

module.exports = router;
