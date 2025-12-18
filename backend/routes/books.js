const express = require('express');
const { body } = require('express-validator');
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBooks);

router.post('/', authenticate, [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('totalCopies').isInt({ min: 1 }).withMessage('Total copies must be at least 1')
], createBook);

router.put('/:id', authenticate, updateBook);
router.delete('/:id', authenticate, deleteBook);

module.exports = router;
