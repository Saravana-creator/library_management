const mongoose = require('mongoose');
const ApprovalRequest = require('./models/ApprovalRequest');

mongoose.connect('mongodb://localhost:27017/library_management');

async function createSampleDonations() {
  try {
    console.log('Creating sample donation requests...');
    
    const donations = [
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        isbn: "978-0-06-231500-7",
        category: "Fiction",
        description: "A philosophical book about following your dreams",
        publishedYear: 1988,
        donorName: "John Smith",
        donorEmail: "john.smith@email.com",
        status: "pending"
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "978-0-7352-1129-2",
        category: "Self-Help",
        description: "An easy and proven way to build good habits",
        publishedYear: 2018,
        donorName: "Sarah Johnson",
        donorEmail: "sarah.j@email.com",
        status: "pending"
      },
      {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        isbn: "978-0-85719-996-8",
        category: "Finance",
        description: "Timeless lessons on wealth, greed, and happiness",
        publishedYear: 2020,
        donorName: "Mike Davis",
        donorEmail: "mike.davis@email.com",
        status: "pending"
      }
    ];

    await ApprovalRequest.deleteMany({}); // Clear existing
    await ApprovalRequest.insertMany(donations);
    
    console.log('Sample donation requests created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSampleDonations();