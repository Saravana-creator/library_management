const mongoose = require('mongoose');
const Book = require('../models/Book');

mongoose.connect('mongodb://localhost:27017/library-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const fixBookCopies = async () => {
  try {
    const books = await Book.find();
    
    for (const book of books) {
      if (book.availableCopies !== book.totalCopies && book.availableCopies < book.totalCopies) {
        console.log(`Fixing ${book.title}: ${book.availableCopies}/${book.totalCopies} -> ${book.totalCopies}/${book.totalCopies}`);
        book.availableCopies = book.totalCopies;
        await book.save();
      }
    }
    
    console.log('Book copies fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixBookCopies();
