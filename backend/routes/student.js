const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getBooks,
  requestBorrow,
  getBorrowingHistory,
  checkDeadlineAlerts,
  calculatePenalties,
  donatebook,
  getDonationStatus
} = require('../controllers/studentController');

const router = express.Router();

router.get('/books', authenticate, getBooks);
router.post('/borrow-request', authenticate, requestBorrow);
router.get('/borrowing-history', authenticate, getBorrowingHistory);
router.get('/deadline-alerts', authenticate, checkDeadlineAlerts);
router.get('/penalties', authenticate, calculatePenalties);
router.post('/donate-book', authenticate, donatebook);
router.get('/donation-status', authenticate, getDonationStatus);

module.exports = router;
