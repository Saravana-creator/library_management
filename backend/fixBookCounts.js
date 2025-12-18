const mongoose = require('mongoose');
const Book = require('./models/Book');
const IssueRecord = require('./models/IssueRecord');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library_management');

async function fixBookCounts() {
  try {
    console.log('Checking and fixing book counts...');
    
    const books = await Book.find({ status: 'active' });
    
    for (const book of books) {
      // Count currently issued books for this book
      const issuedCount = await IssueRecord.countDocuments({
        bookId: book._id,
        status: 'issued'
      });
      
      // Calculate correct available copies
      const correctAvailableCopies = book.totalCopies - issuedCount;
      
      if (book.availableCopies !== correctAvailableCopies) {
        console.log(`Fixing ${book.title}:`);
        console.log(`  Current: ${book.availableCopies}/${book.totalCopies}`);
        console.log(`  Should be: ${correctAvailableCopies}/${book.totalCopies}`);
        console.log(`  Issued count: ${issuedCount}`);
        
        await Book.findByIdAndUpdate(book._id, {
          availableCopies: correctAvailableCopies
        });
        
        console.log(`  Fixed!`);
      } else {
        console.log(`${book.title}: OK (${book.availableCopies}/${book.totalCopies})`);
      }
    }
    
    console.log('Book count fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixBookCounts();