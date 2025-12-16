const express = require('express');
const { body } = require('express-validator');
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

router.get('/', auth, getBooks);

router.post('/', auth, roleAuth('librarian'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('totalCopies').isInt({ min: 1 }).withMessage('Total copies must be at least 1')
], createBook);

router.put('/:id', auth, roleAuth('librarian'), updateBook);
router.delete('/:id', auth, roleAuth('librarian'), deleteBook);

module.exports = router;
