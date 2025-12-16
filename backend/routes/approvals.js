const express = require('express');
const { body } = require('express-validator');
const { getApprovalRequests, createApprovalRequest, reviewApprovalRequest } = require('../controllers/approvalController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

router.put('/:id/review', auth, roleAuth('librarian'), [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('reviewNotes').optional().isString()
], reviewApprovalRequest);

router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
  body('category').notEmpty().withMessage('Category is required')
], createApprovalRequest);

router.get('/', auth, getApprovalRequests);

module.exports = router;
