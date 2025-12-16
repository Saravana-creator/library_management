const ApprovalRequest = require('../models/ApprovalRequest');
const Book = require('../models/Book');

const getApprovalRequests = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 10 } = req.query;
    
    const requests = await ApprovalRequest.find({ status })
      .populate('reviewedBy', 'username')
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
    const { status, reviewNotes } = req.body;
    const request = await ApprovalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    request.reviewNotes = reviewNotes;
    request.reviewedBy = req.librarian._id;
    request.reviewDate = new Date();

    await request.save();

    if (status === 'approved') {
      const book = new Book({
        title: request.title,
        author: request.author,
        isbn: request.isbn,
        category: request.category,
        description: request.description,
        publishedYear: request.publishedYear
      });
      await book.save();
    }

    res.json(await request.populate('reviewedBy', 'username'));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getApprovalRequests, createApprovalRequest, reviewApprovalRequest };