import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from './api';

export const LibrarianRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/librarian/pending-requests');
      setRequests(response.data.borrowRequests || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pending Requests</h1>
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">No pending requests</div>
        ) : (
          requests.map(req => (
            <div key={req._id} className="bg-white rounded-lg shadow p-4">
              <p className="font-semibold">{req.studentId?.name}</p>
              <p className="text-sm text-gray-600">{req.bookId?.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const OverdueStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverdue();
  }, []);

  const fetchOverdue = async () => {
    try {
      const response = await api.get('/librarian/overdue-students');
      setStudents(response.data.overdueStudents || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load overdue students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overdue Students</h1>
      {students.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">No overdue students</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">{student.daysOverdue}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const StudentPenalties = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      const response = await api.get('/librarian/student-penalties');
      setPenalties(response.data.penalties || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load penalties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Penalties</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Penalty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {penalties.map((penalty, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">{penalty.name}</td>
                <td className="px-6 py-4"><span className="font-bold text-red-600">₹{penalty.totalPenalty}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
