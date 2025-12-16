const mongoose = require('mongoose');

const issueRecordSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' },
  librarianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Librarian', required: true }
}, { timestamps: true });

module.exports = mongoose.model('IssueRecord', issueRecordSchema);