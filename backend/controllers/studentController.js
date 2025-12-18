const { Student, BorrowRequest, Donation } = require('../models/Student');
const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

const requestBorrow = async (req, res) => {
  try {
    const { bookId } = req.body;
    const studentId = req.user.id;

    const existing = await BorrowRequest.findOne({ studentId, bookId, status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'Request already pending' });
    }

    const request = new BorrowRequest({ studentId, bookId });
    await request.save();
    res.status(201).json({ message: 'Borrow request submitted', request });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
};

const getBorrowingHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const records = await IssueRecord.find({ studentId }).populate('bookId');
    
    const history = records.map(record => ({
      bookTitle: record.bookId?.title,
      borrowDate: record.issueDate,
      dueDate: record.dueDate,
      returnDate: record.returnDate,
      status: record.status,
      penalty: record.penalty
    }));

    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

const checkDeadlineAlerts = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await IssueRecord.find({ studentId, status: 'issued' });
    const alerts = [];

    records.forEach(record => {
      const dueDate = new Date(record.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate <= today) {
        alerts.push({
          bookId: record.bookId,
          message: 'The book/books are about to cross the deadline.',
          daysOverdue: Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
        });
      }
    });

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: 'Error checking alerts', error: error.message });
  }
};

const calculatePenalties = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await IssueRecord.find({ studentId, status: 'issued' });
    let totalPenalty = 0;

    records.forEach(record => {
      const dueDate = new Date(record.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (today > dueDate) {
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        record.penalty = daysOverdue * 10;
        totalPenalty += record.penalty;
      }
    });

    const student = await Student.findById(studentId);
    student.totalPenalty = totalPenalty;
    await student.save();

    res.json({ totalPenalty, records });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating penalties', error: error.message });
  }
};

const donatebook = async (req, res) => {
  try {
    const { title, author, isbn, category } = req.body;
    const studentId = req.user.id;

    const donation = new Donation({ studentId, title, author, isbn, category });
    await donation.save();
    res.status(201).json({ message: 'Donation request submitted', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting donation', error: error.message });
  }
};

const getDonationStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const donations = await Donation.find({ studentId });
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

const getBorrowRequests = async (req, res) => {
  try {
    const studentId = req.user.id;
    const requests = await BorrowRequest.find({ studentId })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrow requests', error: error.message });
  }
};

const getOverdueBooks = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    const records = await IssueRecord.find({ studentId, status: 'issued' }).populate('bookId', 'title');
    const overdueBooks = [];

    records.forEach(record => {
      const dueDate = new Date(record.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      // Show alert if due date is within 2 days or already overdue
      if (dueDate <= twoDaysFromNow) {
        const daysDifference = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
        let penalty = 0;
        let status = 'due-soon';
        
        if (daysDifference < 0) {
          // Overdue
          penalty = Math.abs(daysDifference) * 10;
          status = 'overdue';
        } else if (daysDifference === 0) {
          status = 'due-today';
        }
        
        overdueBooks.push({
          bookTitle: record.bookId?.title,
          dueDate: record.dueDate,
          daysOverdue: Math.abs(daysDifference),
          penalty,
          status,
          daysDifference
        });
      }
    });

    res.json({ overdueBooks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overdue books', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { name, email, phone, department, semester } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      studentId,
      { name, email, phone, department, semester },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const approveBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await BorrowRequest.findById(requestId).populate('bookId');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    const book = await Book.findById(request.bookId);
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }
    
    // Update request status and decrease book count
    request.status = 'approved';
    request.approvedDate = new Date();
    await request.save();
    
    book.availableCopies -= 1;
    await book.save();
    
    res.json({ message: 'Request approved successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error approving request', error: error.message });
  }
};

const markAsTaken = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await BorrowRequest.findById(requestId);
    if (!request || request.status !== 'approved') {
      return res.status(404).json({ message: 'Approved request not found' });
    }
    
    request.taken = true;
    request.takenDate = new Date();
    await request.save();
    
    res.json({ message: 'Marked as taken', request });
  } catch (error) {
    res.status(500).json({ message: 'Error marking as taken', error: error.message });
  }
};

const cleanupExpiredRequests = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const expiredRequests = await BorrowRequest.find({
      status: 'approved',
      taken: false,
      approvedDate: { $lt: oneWeekAgo }
    }).populate('bookId');
    
    for (const request of expiredRequests) {
      // Restore book count
      const book = await Book.findById(request.bookId);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }
      
      // Delete the request
      await BorrowRequest.findByIdAndDelete(request._id);
    }
    
    console.log(`Cleaned up ${expiredRequests.length} expired requests`);
  } catch (error) {
    console.error('Error cleaning up expired requests:', error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredRequests, 60 * 60 * 1000);

module.exports = {
  getBooks,
  requestBorrow,
  getBorrowingHistory,
  getBorrowRequests,
  checkDeadlineAlerts,
  calculatePenalties,
  donatebook,
  getDonationStatus,
  getOverdueBooks,
  updateProfile,
  approveBorrowRequest,
  markAsTaken
};
