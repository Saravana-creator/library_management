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
  const [borrowRequests, setBorrowRequests] = useState([]);

  useEffect(() => {
    fetchMyBooks();
    fetchBorrowRequests();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const response = await api.get('/student/my-books');
      setMyBooks(response.data.history || []);
    } catch (error) {
      toast.error('Failed to load your books');
    }
  };

  const fetchBorrowRequests = async () => {
    try {
      const response = await api.get('/student/borrow-requests');
      console.log('Borrow requests response:', response.data);
      setBorrowRequests(response.data.requests || []);
    } catch (error) {
      console.error('Failed to load borrow requests:', error);
    }
  };

  console.log('Borrow requests:', borrowRequests);
  console.log('My books:', myBooks);
  
  const allBooks = [
    ...borrowRequests.map(req => ({
      bookTitle: req.bookId?.title || 'Unknown Book',
      author: req.bookId?.author || 'Unknown Author',
      requestDate: req.createdAt,
      approvedDate: req.approvedDate,
      status: req.status,
      type: 'request'
    })),
    ...myBooks.map(book => ({
      ...book,
      type: 'issued'
    }))
  ].sort((a, b) => new Date(b.requestDate || b.borrowDate) - new Date(a.requestDate || a.borrowDate));
  
  console.log('All books combined:', allBooks);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Books & Requests</h1>
      
      {allBooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">You haven't requested or borrowed any books yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allBooks.map((book, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{book.bookTitle}</h3>
                  {book.author && (
                    <p className="text-sm text-gray-600">{book.author}</p>
                  )}
                  {book.type === 'request' ? (
                    <>
                      <p className="text-sm text-gray-500 mt-2">Request Date: {new Date(book.requestDate).toLocaleDateString()}</p>
                      {book.approvedDate && (
                        <p className="text-sm text-gray-500">Approved Date: {new Date(book.approvedDate).toLocaleDateString()}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 mt-2">Borrow Date: {new Date(book.borrowDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Due Date: {new Date(book.dueDate).toLocaleDateString()}</p>
                      {book.returnDate && (
                        <p className="text-sm text-gray-500">Return Date: {new Date(book.returnDate).toLocaleDateString()}</p>
                      )}
                      {book.penalty > 0 && (
                        <p className="text-sm text-red-600 mt-1">Penalty: ₹{book.penalty}</p>
                      )}
                    </>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  book.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  book.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  book.status === 'issued' ? 'bg-orange-100 text-orange-800' : 
                  book.status === 'returned' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {book.status === 'pending' ? 'Pending' :
                   book.status === 'approved' ? 'Approved' :
                   book.status === 'issued' ? 'Issued' :
                   book.status === 'returned' ? 'Returned' :
                   book.status}
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
