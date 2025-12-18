const { BorrowRequest, Donation, Student } = require('../models/Student');
const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/Book');

const approveBorrowRequest = async (req, res) => {
  try {
    const { requestId, dueDate } = req.body;
    const librarianId = req.user.id;

    const request = await BorrowRequest.findById(requestId).populate('studentId').populate('bookId');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const student = request.studentId;
    const book = request.bookId;

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const issue = new IssueRecord({
      bookId: book._id,
      studentId: student._id,
      studentName: student.name,
      studentRollNo: student.studentId,
      studentDept: student.department,
      studentYear: student.semester,
      dueDate: new Date(dueDate),
      librarianId
    });

    await issue.save();
    book.availableCopies -= 1;
    await book.save();

    request.status = 'approved';
    request.approvedDate = new Date();
    await request.save();

    res.json({ message: 'Request approved', issue });
  } catch (error) {
    res.status(500).json({ message: 'Error approving request', error: error.message });
  }
};

const rejectBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await BorrowRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();
    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request', error: error.message });
  }
};

const approveDonation = async (req, res) => {
  try {
    const { donationId } = req.body;
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const book = new Book({
      title: donation.title,
      author: donation.author,
      isbn: donation.isbn,
      category: donation.category,
      totalCopies: 1,
      availableCopies: 1
    });

    await book.save();
    donation.status = 'approved';
    donation.reviewDate = new Date();
    await donation.save();

    res.json({ message: 'Donation approved and added to inventory', book });
  } catch (error) {
    res.status(500).json({ message: 'Error approving donation', error: error.message });
  }
};

const rejectDonation = async (req, res) => {
  try {
    const { donationId } = req.body;
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = 'rejected';
    donation.reviewDate = new Date();
    await donation.save();

    res.json({ message: 'Donation rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting donation', error: error.message });
  }
};

const monitorOverdueStudents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await IssueRecord.find({ status: 'issued' }).populate('studentId');
    const overdueStudents = [];

    records.forEach(record => {
      const dueDate = new Date(record.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        overdueStudents.push({
          rollNo: record.studentRollNo,
          name: record.studentName,
          year: record.studentYear,
          dept: record.studentDept,
          message: `(${record.studentRollNo}, ${record.studentName}, ${record.studentYear}, ${record.studentDept}) – This student yet to cross the deadline.`,
          daysOverdue: Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
        });
      }
    });

    res.json({ overdueStudents });
  } catch (error) {
    res.status(500).json({ message: 'Error monitoring overdue students', error: error.message });
  }
};

const viewStudentPenalties = async (req, res) => {
  try {
    const students = await Student.find().select('name studentId department totalPenalty');
    const penalties = students.map(s => ({
      name: s.name,
      studentId: s.studentId,
      department: s.department,
      totalPenalty: s.totalPenalty
    }));

    res.json({ penalties });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching penalties', error: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const borrowRequests = await BorrowRequest.find({ status: 'pending' })
      .populate('studentId')
      .populate('bookId');
    
    const donations = await Donation.find({ status: 'pending' })
      .populate('studentId');

    res.json({ borrowRequests, donations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

const getApprovedRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ status: 'approved', taken: { $ne: true } })
      .populate('studentId', 'name studentId')
      .populate('bookId', 'title');
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved requests', error: error.message });
  }
};

const markAsTaken = async (req, res) => {
  try {
    const { requestId, returnDate } = req.body;
    const librarianId = req.user.id;

    const request = await BorrowRequest.findById(requestId)
      .populate('studentId')
      .populate('bookId');
    
    if (!request || request.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const dueDate = returnDate ? new Date(returnDate) : (() => {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14);
      return defaultDate;
    })();
    
    // Ensure the date is valid
    if (isNaN(dueDate.getTime())) {
      return res.status(400).json({ message: 'Invalid return date provided' });
    }

    const issue = new IssueRecord({
      bookId: request.bookId._id,
      studentId: request.studentId._id,
      studentName: request.studentId.name,
      studentRollNo: request.studentId.studentId,
      studentDept: request.studentId.department,
      studentYear: request.studentId.semester,
      dueDate,
      librarianId,
      issueDate: new Date()
    });

    await issue.save();
    request.taken = true;
    request.takenDate = new Date();
    await request.save();

    res.json({ message: 'Book marked as taken and issued', issue });
  } catch (error) {
    res.status(500).json({ message: 'Error marking as taken', error: error.message });
  }
};

module.exports = {
  approveBorrowRequest,
  rejectBorrowRequest,
  approveDonation,
  rejectDonation,
  monitorOverdueStudents,
  viewStudentPenalties,
  getPendingRequests,
  getApprovedRequests,
  markAsTaken
};
