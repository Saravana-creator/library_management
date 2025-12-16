# Library Management System

A professional offline-first library management system built with React, Node.js, Express, and MongoDB.

## Features

- **Librarian Authentication**: Secure JWT-based authentication
- **Offline-First Architecture**: Works seamlessly offline with local storage
- **Book Management**: Add, update, delete, search, and filter books
- **Issue/Return System**: Track book transactions with due dates
- **Approval System**: Review and approve book donations
- **Professional UI**: Clean, responsive admin dashboard
- **Real-time Sync**: Automatic synchronization when online

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator

### Frontend
- React 18 with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Dexie for offline storage (IndexedDB)
- React Hook Form for form handling
- React Hot Toast for notifications

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start MongoDB service

5. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## Default Credentials

To create a librarian account, you can either:

1. Use the registration endpoint via API:
```bash
POST /api/auth/register
{
  "username": "admin",
  "email": "admin@library.com",
  "password": "password123"
}
```

2. Or create directly in MongoDB:
```javascript
// In MongoDB shell or Compass
db.librarians.insertOne({
  username: "admin",
  email: "admin@library.com",
  password: "$2a$12$hash_of_password123", // Use bcrypt to hash
  role: "librarian",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Sample Data

### Books
```javascript
// Sample books to add via API or directly to MongoDB
[
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    category: "Fiction",
    totalCopies: 5,
    availableCopies: 5,
    description: "A classic American novel",
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
    description: "A gripping tale of racial injustice",
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
  }
]
```

### Approval Requests
```javascript
// Sample approval requests
[
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
  }
]
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login librarian
- `POST /api/auth/register` - Register new librarian

### Books
- `GET /api/books` - Get all books (with search/filter)
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book (soft delete)

### Issues
- `GET /api/issues` - Get all issue records
- `POST /api/issues/issue` - Issue a book
- `PUT /api/issues/return/:id` - Return a book

### Approvals
- `GET /api/approvals` - Get approval requests
- `POST /api/approvals` - Create approval request
- `PUT /api/approvals/:id/review` - Review approval request

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Offline Functionality

The system uses IndexedDB (via Dexie) for offline storage:

- All operations work offline
- Data is queued for synchronization
- Automatic sync when connection is restored
- Visual indicators for online/offline status

## Project Structure

```
library-management-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Production Deployment

### Backend
1. Set production environment variables
2. Use PM2 or similar for process management
3. Set up reverse proxy with Nginx
4. Use MongoDB Atlas for cloud database

### Frontend
1. Build the production bundle: `npm run build`
2. Serve static files with Nginx or similar
3. Configure proper API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.