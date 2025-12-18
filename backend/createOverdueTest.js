const mongoose = require('mongoose');
const IssueRecord = require('./models/IssueRecord');
const { Student } = require('./models/Student');
const Book = require('./models/Book');
require('dotenv').config();

const createOverdueTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management');
    
    // Find a student and book
    const student = await Student.findOne();
    const book = await Book.findOne();
    
    if (!student || !book) {
      console.log('Need at least one student and one book in database');
      process.exit(1);
    }
    
    // Create an overdue issue record (due date 5 days ago)
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 5);
    
    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - 19); // Issued 19 days ago
    
    // Find a librarian for the record
    const Librarian = require('./models/Librarian');
    const librarian = await Librarian.findOne();
    
    const overdueRecord = new IssueRecord({
      bookId: book._id,
      studentId: student._id,
      studentName: student.name,
      studentRollNo: student.studentId,
      studentDept: student.department,
      studentYear: student.semester,
      dueDate: overdueDate,
      issueDate: issueDate,
      status: 'issued',
      librarianId: librarian._id
    });
    
    await overdueRecord.save();
    console.log('Created overdue test record');
    console.log(`Student: ${student.name} (${student.studentId})`);
    console.log(`Book: ${book.title}`);
    console.log(`Due date: ${overdueDate.toDateString()}`);
    console.log('Now login as this student to see the alert');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createOverdueTest();