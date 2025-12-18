const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getBooks,
  requestBorrow,
  getBorrowingHistory,
  checkDeadlineAlerts,
  calculatePenalties,
  donatebook,
  getDonationStatus,
  getOverdueBooks
} = require('../controllers/studentController');

const router = express.Router();

router.get('/books', authenticate, getBooks);
router.post('/borrow-request', authenticate, requestBorrow);
router.get('/my-books', authenticate, getBorrowingHistory);
router.get('/borrowing-history', authenticate, getBorrowingHistory);
router.get('/deadline-alerts', authenticate, checkDeadlineAlerts);
router.get('/penalties', authenticate, calculatePenalties);
router.post('/donate-book', authenticate, donatebook);
router.get('/donation-status', authenticate, getDonationStatus);
router.get('/overdue-books', authenticate, getOverdueBooks);

module.exports = router;
