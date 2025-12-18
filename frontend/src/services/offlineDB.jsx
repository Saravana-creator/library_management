import Dexie from 'dexie';

class OfflineDB extends Dexie {
  constructor() {
    super('LibraryManagementDB');
    
    this.version(1).stores({
      books: '++id, title, author, isbn, category, status',
      issues: '++id, bookId, studentName, studentId, status, issueDate',
      approvals: '++id, title, author, isbn, status, createdAt',
      syncQueue: '++id, operation, collection, data, timestamp'
    });
  }
}

const db = new OfflineDB();

export const offlineService = {
  // Books
  async getBooks(filters = {}) {
    let collection = db.books.where('status').equals('active');
    
    if (filters.search) {
      collection = collection.and(book => 
        book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      collection = collection.and(book => book.category === filters.category);
    }
    
    return await collection.toArray();
  },

  async addBook(book) {
    const id = await db.books.add({ ...book, status: 'active' });
    await this.addToSyncQueue('create', 'books', { ...book, id });
    return id;
  },

  async updateBook(id, book) {
    await db.books.update(id, book);
    await this.addToSyncQueue('update', 'books', { ...book, id });
  },

  async deleteBook(id) {
    await db.books.update(id, { status: 'inactive' });
    await this.addToSyncQueue('delete', 'books', { id });
  },

  // Issues
  async getIssues(filters = {}) {
    let collection = db.issues;
    
    if (filters.status) {
      collection = collection.where('status').equals(filters.status);
    }
    
    return await collection.toArray();
  },

  async issueBook(issueData) {
    const id = await db.issues.add({ ...issueData, status: 'issued' });
    await this.addToSyncQueue('create', 'issues', { ...issueData, id });
    
    // Update book availability
    const book = await db.books.get(issueData.bookId);
    if (book) {
      await db.books.update(issueData.bookId, { 
        availableCopies: book.availableCopies - 1 
      });
    }
    
    return id;
  },

  async returnBook(id) {
    const issue = await db.issues.get(id);
    if (issue) {
      await db.issues.update(id, { 
        status: 'returned', 
        returnDate: new Date() 
      });
      await this.addToSyncQueue('update', 'issues', { ...issue, id, status: 'returned' });
      
      // Update book availability
      const book = await db.books.get(issue.bookId);
      if (book) {
        await db.books.update(issue.bookId, { 
          availableCopies: book.availableCopies + 1 
        });
      }
    }
  },

  // Approvals
  async getApprovals(filters = {}) {
    let collection = db.approvals;
    
    if (filters.status) {
      collection = collection.where('status').equals(filters.status);
    }
    
    return await collection.toArray();
  },

  async reviewApproval(id, reviewData) {
    await db.approvals.update(id, reviewData);
    await this.addToSyncQueue('update', 'approvals', { ...reviewData, id });
    
    // If approved, add to books
    if (reviewData.status === 'approved') {
      const approval = await db.approvals.get(id);
      if (approval) {
        await this.addBook({
          title: approval.title,
          author: approval.author,
          isbn: approval.isbn,
          category: approval.category,
          description: approval.description,
          totalCopies: 1,
          availableCopies: 1
        });
      }
    }
  },

  // Sync Queue
  async addToSyncQueue(operation, collection, data) {
    await db.syncQueue.add({
      operation,
      collection,
      data,
      timestamp: new Date()
    });
  },

  async getSyncQueue() {
    return await db.syncQueue.orderBy('timestamp').toArray();
  },

  async clearSyncQueue() {
    await db.syncQueue.clear();
  },

  // Dashboard Stats
  async getDashboardStats() {
    const [totalBooks, issuedBooks, returnedBooks, pendingApprovals] = await Promise.all([
      db.books.where('status').equals('active').count(),
      db.issues.where('status').equals('issued').count(),
      db.issues.where('status').equals('returned').count(),
      db.approvals.where('status').equals('pending').count()
    ]);

    return {
      totalBooks,
      issuedBooks,
      returnedBooks,
      pendingApprovals
    };
  }
};

export default db;
