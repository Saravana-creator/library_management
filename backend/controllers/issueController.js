const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/Book');

const issueBook = async (req, res) => {
  try {
    const { bookId, studentName, studentId, dueDate } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const issueRecord = new IssueRecord({
      bookId,
      studentName,
      studentRollNo: studentId,
      dueDate,
      librarianId: req.user.id
    });

    await issueRecord.save();
    await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1 } });

    res.status(201).json(await issueRecord.populate('bookId'));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const issueRecord = await IssueRecord.findById(req.params.id);
    if (!issueRecord || issueRecord.status !== 'issued') {
      return res.status(404).json({ message: 'Issue record not found or already returned' });
    }

    issueRecord.returnDate = new Date();
    issueRecord.status = 'returned';
    await issueRecord.save();

    await Book.findByIdAndUpdate(issueRecord.bookId, { $inc: { availableCopies: 1 } });

    res.json(await issueRecord.populate('bookId'));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getIssueRecords = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;

    const records = await IssueRecord.find(query)
      .populate('bookId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await IssueRecord.countDocuments(query);

    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { issueBook, returnBook, getIssueRecords };
