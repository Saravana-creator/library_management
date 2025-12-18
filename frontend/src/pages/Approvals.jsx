import React, { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, [statusFilter]);

  const fetchApprovals = async () => {
    try {
      const response = await api.get('/approvals', { params: { status: statusFilter, type: 'borrow' } });
      setApprovals(response.data.requests || []);
    } catch (error) {
      toast.error('Error fetching approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (approval, status) => {
    setSelectedApproval({ ...approval, reviewStatus: status });
    setReviewNotes('');
    setShowReviewModal(true);
  };

  const onSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/approvals/${selectedApproval._id}/review`, {
        status: selectedApproval.reviewStatus,
        reviewNotes,
        type: 'borrow'
      });
      
      toast.success(`Request ${selectedApproval.reviewStatus} successfully`);
      setShowReviewModal(false);
      setSelectedApproval(null);
      setReviewNotes('');
      fetchApprovals();
    } catch (error) {
      toast.error('Error reviewing request');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Borrow Requests</h1>
        <p className="text-gray-600 mt-2">Review and approve student book requests</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {approvals.map((approval) => (
          <div key={approval._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{approval.bookId?.title}</h3>
                <p className="text-gray-600">by {approval.bookId?.author}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {approval.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-medium">{approval.studentId?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-medium">{approval.studentId?.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{approval.studentId?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Request Date</p>
                <p className="font-medium">{formatDate(approval.createdAt)}</p>
              </div>
            </div>

            {approval.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleReview(approval, 'approved')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Check size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleReview(approval, 'rejected')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {approvals.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No {statusFilter} approval requests found.</p>
          </div>
        )}
      </div>

      {showReviewModal && selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedApproval.reviewStatus === 'approved' ? 'Approve' : 'Reject'} Book
            </h2>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedApproval.bookId?.title}</p>
              <p className="text-sm text-gray-600">by {selectedApproval.bookId?.author}</p>
              <p className="text-sm text-gray-600 mt-1">Student: {selectedApproval.studentId?.name}</p>
            </div>
            
            <form onSubmit={onSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Add your review notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
                    selectedApproval.reviewStatus === 'approved'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {selectedApproval.reviewStatus === 'approved' ? 'Approve' : 'Reject'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedApproval(null);
                    setReviewNotes('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
