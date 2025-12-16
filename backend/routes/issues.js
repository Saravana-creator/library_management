const express = require('express');
const { body } = require('express-validator');
const { issueBook, returnBook, getIssueRecords } = require('../controllers/issueController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

router.post('/issue', auth, roleAuth('librarian'), [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('studentName').notEmpty().withMessage('Student name is required'),
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
], issueBook);

router.put('/return/:id', auth, roleAuth('librarian'), returnBook);

router.get('/', auth, getIssueRecords);

module.exports = router;
