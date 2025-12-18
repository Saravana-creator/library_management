import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const StudentMyBooks = () => {
  const [myBooks, setMyBooks] = useState([]);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const response = await api.get('/student/my-books');
      setMyBooks(response.data.history || []);
    } catch (error) {
      toast.error('Failed to load your books');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Books</h1>
      
      {myBooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">You haven't borrowed any books yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBooks.map((book, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{book.bookTitle}</h3>
                  <p className="text-sm text-gray-500 mt-2">Borrow Date: {new Date(book.borrowDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Due Date: {new Date(book.dueDate).toLocaleDateString()}</p>
                  {book.returnDate && (
                    <p className="text-sm text-gray-500">Return Date: {new Date(book.returnDate).toLocaleDateString()}</p>
                  )}
                  {book.penalty > 0 && (
                    <p className="text-sm text-red-600 mt-1">Penalty: ₹{book.penalty}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  book.status === 'issued' ? 'bg-orange-100 text-orange-800' : 
                  book.status === 'returned' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {book.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMyBooks;
