const mongoose = require('mongoose');
const IssueRecord = require('./models/IssueRecord');
const { Student } = require('./models/Student');
const Book = require('./models/Book');
require('dotenv').config();

const checkIssueRecords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management');
    
    const records = await IssueRecord.find().populate('studentId').populate('bookId');
    
    console.log(`Total issue records: ${records.length}`);
    
    records.forEach((record, index) => {
      console.log(`\n${index + 1}. Issue Record:`);
      console.log(`   Student Name: ${record.studentName}`);
      console.log(`   Student ID from record: ${record.studentRollNo}`);
      console.log(`   Student ID from populated: ${record.studentId?.studentId}`);
      console.log(`   Book: ${record.bookId?.title}`);
      console.log(`   Due Date: ${record.dueDate}`);
      console.log(`   Status: ${record.status}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkIssueRecords();