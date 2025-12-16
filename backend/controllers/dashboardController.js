const Book = require('../models/Book');
const IssueRecord = require('../models/IssueRecord');
const ApprovalRequest = require('../models/ApprovalRequest');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalBooks,
      issuedBooks,
      returnedBooks,
      pendingApprovals
    ] = await Promise.all([
      Book.countDocuments({ status: 'active' }),
      IssueRecord.countDocuments({ status: 'issued' }),
      IssueRecord.countDocuments({ status: 'returned' }),
      ApprovalRequest.countDocuments({ status: 'pending' })
    ]);

    const recentIssues = await IssueRecord.find({ status: 'issued' })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReturns = await IssueRecord.find({ status: 'returned' })
      .populate('bookId', 'title author')
      .sort({ returnDate: -1 })
      .limit(5);

    res.json({
      stats: {
        totalBooks,
        issuedBooks,
        returnedBooks,
        pendingApprovals
      },
      recentIssues,
      recentReturns
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats };