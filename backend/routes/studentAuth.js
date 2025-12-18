const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/studentAuthController');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('semester').isInt({ min: 1 }).withMessage('Semester is required')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

module.exports = router;