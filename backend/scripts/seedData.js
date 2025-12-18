require('dotenv').config();
const mongoose = require('mongoose');
const Librarian = require('../models/Librarian');
const Book = require('../models/Book');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await Librarian.deleteMany({});
    await Book.deleteMany({});

    const librarian = new Librarian({
      username: 'admin',
      email: 'admin@library.com',
      password: 'password123'
    });
    await librarian.save();
    console.log('Librarian created: admin / password123');

    const books = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', totalCopies: 5, availableCopies: 5 },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', category: 'Fiction', totalCopies: 3, availableCopies: 3 },
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', totalCopies: 4, availableCopies: 4 }
    ];
    await Book.insertMany(books);
    console.log('Books seeded');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
