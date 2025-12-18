import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const StudentBrowseBooks = ({ api }) => {
  const [books, setBooks] = useState([]);
  
  const handleRequest = async (bookId) => {
    try {
      await api.post('/student/borrow-request', { bookId });
      toast.success('Request submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting request');
    }
  };
  
  useEffect(() => { 
    api.get('/books').then(r => setBooks(r.data.books || [])).catch(() => {}); 
  }, []);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-500 mt-2">Available: {book.availableCopies}/{book.totalCopies}</p>
            <button 
              onClick={() => handleRequest(book._id)} 
              disabled={book.availableCopies === 0}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {book.availableCopies === 0 ? 'Not Available' : 'Request Book'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Requests = ({ api }) => {
  const [requests, setRequests] = useState([]);
  
  const fetchRequests = () => {
    api.get('/librarian/pending-requests').then(r => setRequests(r.data.borrowRequests || [])).catch(() => {});
  };
  
  const handleApprove = async (requestId) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    try {
      await api.post('/librarian/approve-borrow', { requestId, dueDate: dueDate.toISOString() });
      toast.success('Request approved');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving request');
    }
  };
  
  const handleReject = async (requestId) => {
    try {
      await api.post('/librarian/reject-borrow', { requestId });
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rejecting request');
    }
  };
  
  useEffect(() => { fetchRequests(); }, []);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pending Requests</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {requests.length === 0 ? (
          <p className="text-gray-600">No pending requests</p>
        ) : (
          requests.map(req => (
            <div key={req._id} className="p-4 border-b flex justify-between items-center">
              <div>
                <p className="font-semibold">{req.studentId?.name}</p>
                <p className="text-sm text-gray-600">{req.bookId?.title}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleApprove(req._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(req._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
