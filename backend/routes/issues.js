const express = require('express');
const { body, validationResult } = require('express-validator');
const { issueBook, returnBook, getIssueRecords } = require('../controllers/issueController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

router.post('/issue', authenticate, [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('studentName').notEmpty().withMessage('Student name is required'),
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
], handleValidationErrors, issueBook);

router.put('/return/:id', authenticate, returnBook);
router.get('/', authenticate, getIssueRecords);

module.exports = router;
