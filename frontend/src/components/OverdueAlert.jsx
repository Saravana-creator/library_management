import React, { useState, useEffect } from 'react';
import api from '../api';

const OverdueAlert = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    checkOverdueBooks();
  }, []);

  const checkOverdueBooks = async () => {
    try {
      const response = await api.get('/student/overdue-books');
      const overdue = response.data.overdueBooks || [];
      setOverdueBooks(overdue);
      setShowAlert(overdue.length > 0);
    } catch (error) {
      console.error('Error checking overdue books:', error);
    }
  };

  if (!showAlert) return null;

  const totalPenalty = overdueBooks.reduce((sum, book) => sum + book.penalty, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 border-l-4 border-red-500">
        <div className="flex items-center mb-4">
          <div className="text-red-500 text-3xl mr-3">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600">Book Return Alert!</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            You have <span className="font-bold text-red-600">{overdueBooks.length}</span> book(s) requiring attention.
          </p>
          
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-800 mb-2">Books Requiring Attention:</h3>
            <ul className="text-sm text-red-700">
              {overdueBooks.map((book, index) => {
                let message = '';
                if (book.status === 'overdue') {
                  message = `${book.daysOverdue} days overdue`;
                } else if (book.status === 'due-today') {
                  message = 'due today';
                } else if (book.daysDifference === 1) {
                  message = 'due tomorrow';
                } else {
                  message = `due in ${book.daysDifference} days`;
                }
                
                return (
                  <li key={index} className="mb-1">
                    • {book.bookTitle} - {message}
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 font-semibold">
              Total Penalty: ₹{totalPenalty}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowAlert(false)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverdueAlert;