import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

const ApprovedRequests = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const response = await api.get('/librarian/approved-requests');
      setApprovedRequests(response.data.requests || []);
    } catch (error) {
      toast.error('Failed to load approved requests');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsTaken = async (requestId) => {
    try {
      await api.post('/librarian/mark-as-taken', { requestId });
      toast.success('Book marked as taken and issued to student');
      fetchApprovedRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error marking book as taken');
    }
  };

  const filteredRequests = approvedRequests.filter(req =>
    req.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.studentId?.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Approved Requests - Ready for Pickup</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No matching requests found' : 'No approved requests waiting for pickup'}
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req._id}>
                  <td className="px-6 py-4 font-medium">{req.studentId?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{req.studentId?.studentId}</td>
                  <td className="px-6 py-4 text-gray-600">{req.bookId?.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(req.approvedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleMarkAsTaken(req._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Mark as Taken
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedRequests;
