const mongoose = require('mongoose');
const IssueRecord = require('./models/IssueRecord');
require('dotenv').config();

const cleanupRecords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management');
    
    // Delete all issue records first
    await IssueRecord.deleteMany({});
    console.log('Deleted all existing issue records');
    
    // Create clean test data
    const { Student } = require('./models/Student');
    const Book = require('./models/Book');
    const Librarian = require('./models/Librarian');
    
    const selvapriyan = await Student.findOne({ studentId: '24CS219' });
    const sherbin = await Student.findOne({ studentId: '24CS225' });
    const gatsby = await Book.findOne({ title: 'The Great Gatsby' });
    const sapiens = await Book.findOne({ title: 'Sapiens' });
    const librarian = await Librarian.findOne();
    
    if (selvapriyan && gatsby && librarian) {
      // Create overdue record for Selvapriyan
      const overdueDate = new Date();
      overdueDate.setDate(overdueDate.getDate() - 3);
      
      const selvapriyanRecord = new IssueRecord({
        bookId: gatsby._id,
        studentId: selvapriyan._id,
        studentName: selvapriyan.name,
        studentRollNo: selvapriyan.studentId,
        studentDept: selvapriyan.department,
        studentYear: selvapriyan.semester,
        dueDate: overdueDate,
        issueDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
        status: 'issued',
        librarianId: librarian._id
      });
      
      await selvapriyanRecord.save();
      console.log('Created overdue record for Selvapriyan - The Great Gatsby');
    }
    
    if (sherbin && sapiens && librarian) {
      // Create current record for Sherbin
      const futureDate = new Date('2025-12-20');
      
      const sherbinRecord = new IssueRecord({
        bookId: sapiens._id,
        studentId: sherbin._id,
        studentName: sherbin.name,
        studentRollNo: sherbin.studentId,
        studentDept: sherbin.department,
        studentYear: sherbin.semester,
        dueDate: futureDate,
        issueDate: new Date('2025-12-06'),
        status: 'issued',
        librarianId: librarian._id
      });
      
      await sherbinRecord.save();
      console.log('Created current record for Sherbin - Sapiens');
    }
    
    console.log('Cleanup completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

cleanupRecords();