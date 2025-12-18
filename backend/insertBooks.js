const mongoose = require('mongoose');
require('dotenv').config();

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  description: String,
  publishedYear: Number,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

const books = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-7432-7356-5", category: "Fiction", totalCopies: 5, availableCopies: 5, publishedYear: 1925 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0-06-112008-4", category: "Fiction", totalCopies: 3, availableCopies: 3, publishedYear: 1960 },
  { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0-13-235088-4", category: "Technology", totalCopies: 2, availableCopies: 2, publishedYear: 2008 },
  { title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", category: "Fiction", totalCopies: 4, availableCopies: 4, publishedYear: 1949 },
  { title: "The Art of War", author: "Sun Tzu", isbn: "978-1-59030-963-7", category: "History", totalCopies: 2, availableCopies: 2, publishedYear: -500 },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", isbn: "978-0-596-51774-8", category: "Technology", totalCopies: 3, availableCopies: 3, publishedYear: 2008 },
  { title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0-14-143951-8", category: "Fiction", totalCopies: 2, availableCopies: 2, publishedYear: 1813 },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "978-0-316-76948-0", category: "Fiction", totalCopies: 3, availableCopies: 3, publishedYear: 1951 },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0-262-03384-8", category: "Technology", totalCopies: 2, availableCopies: 2, publishedYear: 2009 },
  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0-06-231609-7", category: "Non-Fiction", totalCopies: 4, availableCopies: 4, publishedYear: 2011 }
];

const insertBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management');
    await Book.insertMany(books);
    console.log('10 books inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

insertBooks();