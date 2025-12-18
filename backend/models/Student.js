const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  semester: { type: Number },
  role: { type: String, default: 'student' },
  totalPenalty: { type: Number, default: 0 }
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const borrowRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  approvedDate: { type: Date }
}, { timestamps: true });

const donationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  category: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  reviewDate: { type: Date }
}, { timestamps: true });

module.exports = {
  Student: mongoose.model('Student', studentSchema),
  BorrowRequest: mongoose.model('BorrowRequest', borrowRequestSchema),
  Donation: mongoose.model('Donation', donationSchema)
};
