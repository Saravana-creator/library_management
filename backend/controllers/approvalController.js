const ApprovalRequest = require('../models/ApprovalRequest');
const Book = require('../models/Book');

const getApprovalRequests = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 10, type } = req.query;
    
    if (type === 'borrow') {
      const { BorrowRequest } = require('../models/Student');
      const requests = await BorrowRequest.find({ status })
        .populate('studentId', 'name email studentId')
        .populate('bookId', 'title author isbn')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await BorrowRequest.countDocuments({ status });

      return res.json({
        requests,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    }
    
    // Default to donation requests (ApprovalRequest model)
    const requests = await ApprovalRequest.find({ status })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ApprovalRequest.countDocuments({ status });

    res.json({
      requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createApprovalRequest = async (req, res) => {
  try {
    const request = new ApprovalRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const reviewApprovalRequest = async (req, res) => {
  try {
    const { status, reviewNotes, type, totalCopies } = req.body;
    
    if (type === 'borrow') {
      const { BorrowRequest } = require('../models/Student');
      const IssueRecord = require('../models/IssueRecord');
      const request = await BorrowRequest.findById(req.params.id).populate('bookId studentId');

      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      request.status = status;
      request.approvedDate = new Date();
      await request.save();

      if (status === 'approved') {
        const book = await Book.findById(request.bookId);
        if (book.availableCopies > 0) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 14);

          const issueRecord = new IssueRecord({
            bookId: request.bookId,
            studentId: request.studentId,
            studentName: request.studentId.name,
            studentRollNo: request.studentId.studentId,
            studentDept: request.studentId.department,
            dueDate,
            librarianId: req.user.id
          });
          await issueRecord.save();

          book.availableCopies -= 1;
          await book.save();
        }
      }

      return res.json(request);
    }

    // Default to donation requests (ApprovalRequest model)
    const request = await ApprovalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    request.reviewNotes = reviewNotes;
    request.reviewedBy = req.user?.id;
    request.reviewDate = new Date();

    await request.save();

    if (status === 'approved') {
      const copies = totalCopies || 1;
      const book = new Book({
        title: request.title,
        author: request.author,
        isbn: request.isbn,
        category: request.category,
        description: request.description,
        publishedYear: request.publishedYear,
        totalCopies: copies,
        availableCopies: copies
      });
      await book.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getApprovalRequests, createApprovalRequest, reviewApprovalRequest };
