require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Librarian = require('../models/Librarian');
const Book = require('../models/Book');
const ApprovalRequest = require('../models/ApprovalRequest');

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
    // Clear existing data
    await Librarian.deleteMany({});
    await Book.deleteMany({});
    await ApprovalRequest.deleteMany({});

    // Create librarian (don't hash password manually, let the model do it)
    const librarian = await Librarian.create({
      username: 'admin',
      email: 'admin@library.com',
      password: 'password123',
      role: 'librarian'
    });

    console.log('Librarian created:', librarian.username);

    // Create sample books
    const books = await Book.insertMany([
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5",
        category: "Fiction",
        totalCopies: 5,
        availableCopies: 5,
        description: "A classic American novel set in the Jazz Age",
        publishedYear: 1925,
        status: "active"
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        category: "Fiction",
        totalCopies: 3,
        availableCopies: 3,
        description: "A gripping tale of racial injustice and childhood innocence",
        publishedYear: 1960,
        status: "active"
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "978-0-13-235088-4",
        category: "Technology",
        totalCopies: 2,
        availableCopies: 2,
        description: "A handbook of agile software craftsmanship",
        publishedYear: 2008,
        status: "active"
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "978-0-316-76948-0",
        category: "Fiction",
        totalCopies: 4,
        availableCopies: 4,
        description: "A controversial novel about teenage rebellion",
        publishedYear: 1951,
        status: "active"
      },
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        isbn: "978-0-553-38016-3",
        category: "Science",
        totalCopies: 2,
        availableCopies: 2,
        description: "A landmark volume in science writing",
        publishedYear: 1988,
        status: "active"
      }
    ]);

    console.log(`${books.length} books created`);

    // Create sample approval requests
    const approvals = await ApprovalRequest.insertMany([
      {
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-452-28423-4",
        category: "Fiction",
        description: "Dystopian social science fiction novel",
        publishedYear: 1949,
        donorName: "John Doe",
        donorEmail: "john@example.com",
        status: "pending"
      },
      {
        title: "The Art of War",
        author: "Sun Tzu",
        isbn: "978-1-59030-963-7",
        category: "History",
        description: "Ancient Chinese military treatise",
        publishedYear: -500,
        donorName: "Jane Smith",
        donorEmail: "jane@example.com",
        status: "pending"
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "978-0-14-143951-8",
        category: "Fiction",
        description: "A romantic novel of manners",
        publishedYear: 1813,
        donorName: "Alice Johnson",
        donorEmail: "alice@example.com",
        status: "approved",
        reviewedBy: librarian._id,
        reviewDate: new Date(),
        reviewNotes: "Excellent addition to our fiction collection"
      }
    ]);

    console.log(`${approvals.length} approval requests created`);

    console.log('\n=== SEED DATA COMPLETED ===');
    console.log('Login credentials:');
    console.log('Username: admin');
    console.log('Password: password123');
    console.log('Email: admin@library.com');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
