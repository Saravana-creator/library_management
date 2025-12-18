const express = require('express');
const { body } = require('express-validator');
const { getApprovalRequests, createApprovalRequest, reviewApprovalRequest } = require('../controllers/approvalController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// PUT and POST routes must come before GET to avoid route conflicts
router.put('/:id/review', authenticate, [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('reviewNotes').optional().isString()
], reviewApprovalRequest);

router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
  body('category').notEmpty().withMessage('Category is required')
], createApprovalRequest);

router.get('/', authenticate, getApprovalRequests);

module.exports = router;
