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

module.exports = {
  getBooks,
  requestBorrow,
  getBorrowingHistory,
  checkDeadlineAlerts,
  calculatePenalties,
  donatebook,
  getDonationStatus
};
