const express = require('express');
const { body } = require('express-validator');
const { issueBook, returnBook, getIssueRecords } = require('../controllers/issueController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/issue', authenticate, [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('studentName').notEmpty().withMessage('Student name is required'),
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
], issueBook);

router.put('/return/:id', authenticate, returnBook);
router.get('/', authenticate, getIssueRecords);

module.exports = router;
