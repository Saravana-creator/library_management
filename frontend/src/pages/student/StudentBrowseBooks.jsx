import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const StudentBrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History'];

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedCategory]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books', { 
        params: { search: searchTerm, category: selectedCategory } 
      });
      setBooks(response.data.books || []);
    } catch (error) {
      toast.error('Failed to load books');
    }
  };

  const handleRequestBook = async (bookId) => {
    try {
      await api.post('/student/borrow-request', { bookId });
      toast.success('Book request sent successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request book');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Books</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-2">by {book.author}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {book.category}</p>
            <p className="text-sm text-gray-500 mb-4">Available: {book.availableCopies}/{book.totalCopies}</p>
            <button
              onClick={() => handleRequestBook(book._id)}
              disabled={book.availableCopies === 0}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {book.availableCopies === 0 ? 'Not Available' : 'Request Book'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentBrowseBooks;
