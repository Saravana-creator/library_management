const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  approveBorrowRequest,
  rejectBorrowRequest,
  approveDonation,
  rejectDonation,
  monitorOverdueStudents,
  viewStudentPenalties,
  getPendingRequests
} = require('../controllers/librarianController');

const router = express.Router();

router.post('/approve-borrow', authenticate, approveBorrowRequest);
router.post('/reject-borrow', authenticate, rejectBorrowRequest);
router.post('/approve-donation', authenticate, approveDonation);
router.post('/reject-donation', authenticate, rejectDonation);
router.get('/overdue-students', authenticate, monitorOverdueStudents);
router.get('/student-penalties', authenticate, viewStudentPenalties);
router.get('/pending-requests', authenticate, getPendingRequests);

module.exports = router;
