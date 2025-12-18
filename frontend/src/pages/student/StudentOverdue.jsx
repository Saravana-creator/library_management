import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';

const StudentOverdue = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  const fetchOverdueBooks = async () => {
    try {
      const response = await api.get('/student/overdue-books');
      setOverdueBooks(response.data.overdueBooks || []);
    } catch (error) {
      toast.error('Failed to load overdue books');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-red-600">Books Due Soon & Overdue</h1>
      
      {overdueBooks.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-800 text-center">No books due soon or overdue! Keep up the good work!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">Book Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">Days Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">Penalty (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {overdueBooks.map((book, index) => {
                const bgColor = book.status === 'overdue' ? 'bg-red-50' : book.status === 'due-today' ? 'bg-yellow-50' : 'bg-orange-50';
                const textColor = book.status === 'overdue' ? 'text-red-700' : book.status === 'due-today' ? 'text-yellow-700' : 'text-orange-700';
                
                let statusText = '';
                if (book.status === 'overdue') {
                  statusText = `${book.daysOverdue} days overdue`;
                } else if (book.status === 'due-today') {
                  statusText = 'Due today';
                } else if (book.daysDifference === 1) {
                  statusText = 'Due tomorrow';
                } else {
                  statusText = `Due in ${book.daysDifference} days`;
                }
                
                return (
                  <tr key={index} className={bgColor}>
                    <td className={`px-6 py-4 font-medium ${textColor}`}>{book.bookTitle}</td>
                    <td className={`px-6 py-4 ${textColor}`}>{new Date(book.dueDate).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 ${textColor} font-semibold`}>{statusText}</td>
                    <td className={`px-6 py-4 ${textColor} font-bold`}>₹{book.penalty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="bg-red-100 px-6 py-4">
            <p className="text-red-800 font-semibold">
              Total Penalty: ₹{overdueBooks.reduce((sum, book) => sum + book.penalty, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOverdue;