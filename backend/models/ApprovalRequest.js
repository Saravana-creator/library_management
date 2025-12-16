const mongoose = require('mongoose');

const approvalRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  publishedYear: { type: Number },
  donorName: { type: String },
  donorEmail: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Librarian' },
  reviewDate: { type: Date },
  reviewNotes: { type: String },
  // Fields for issue requests
  requestType: { type: String, enum: ['donation', 'issue'], default: 'donation' },
  studentName: { type: String },
  studentId: { type: String },
  dueDate: { type: Date },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
}, { timestamps: true });

module.exports = mongoose.model('ApprovalRequest', approvalRequestSchema);