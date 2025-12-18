const mongoose = require('mongoose');
const IssueRecord = require('./models/IssueRecord');
const { Student } = require('./models/Student');
const Book = require('./models/Book');
const Librarian = require('./models/Librarian');
require('dotenv').config();

const createDueSoonTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management');
    
    const sherbin = await Student.findOne({ studentId: '24CS225' });
    const sapiens = await Book.findOne({ title: 'Sapiens' });
    const librarian = await Librarian.findOne();
    
    if (!sherbin || !sapiens || !librarian) {
      console.log('Could not find required data');
      process.exit(1);
    }
    
    // Delete existing record for Sherbin
    await IssueRecord.deleteMany({ studentId: sherbin._id, bookId: sapiens._id });
    
    // Create record due tomorrow
    const dueTomorrow = new Date();
    dueTomorrow.setDate(dueTomorrow.getDate() + 1);
    
    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - 13);
    
    const record = new IssueRecord({
      bookId: sapiens._id,
      studentId: sherbin._id,
      studentName: sherbin.name,
      studentRollNo: sherbin.studentId,
      studentDept: sherbin.department,
      studentYear: sherbin.semester,
      dueDate: dueTomorrow,
      issueDate: issueDate,
      status: 'issued',
      librarianId: librarian._id
    });
    
    await record.save();
    console.log('Created due-soon record for Sherbin');
    console.log(`Student: ${sherbin.name} (${sherbin.studentId})`);
    console.log(`Book: ${sapiens.title}`);
    console.log(`Due date: ${dueTomorrow.toDateString()} (due tomorrow)`);
    console.log('Now login as Sherbin to see the alert');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createDueSoonTest();