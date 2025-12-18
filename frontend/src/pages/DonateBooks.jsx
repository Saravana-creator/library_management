import React, { useState, useEffect } from 'react';
import { Check, X, Clock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const DonateBooks = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [totalCopies, setTotalCopies] = useState(1);

  useEffect(() => {
    fetchDonations();
  }, [statusFilter]);

  const fetchDonations = async () => {
    try {
      console.log('Fetching donations with status:', statusFilter);
      const response = await api.get('/approvals', { params: { status: statusFilter } });
      console.log('API response:', response.data);
      setDonations(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Error fetching donation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (donation, status) => {
    setSelectedDonation({ ...donation, reviewStatus: status });
    setReviewNotes('');
    setTotalCopies(1);
    setShowReviewModal(true);
  };

  const onSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        status: selectedDonation.reviewStatus,
        reviewNotes,
        totalCopies: selectedDonation.reviewStatus === 'approved' ? totalCopies : undefined
      };

      await api.put(`/approvals/${selectedDonation._id}/review`, reviewData);
      
      toast.success(`Donation ${selectedDonation.reviewStatus} successfully`);
      setShowReviewModal(false);
      setSelectedDonation(null);
      setReviewNotes('');
      setTotalCopies(1);
      fetchDonations();
    } catch (error) {
      toast.error('Error reviewing donation request');
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
        <h1 className="text-3xl font-bold text-gray-900">Approve Request to Donate Book</h1>
        <p className="text-gray-600 mt-2">Review and approve book donation requests</p>
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
        {donations.map((donation) => (
          <div key={donation._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{donation.title}</h3>
                <p className="text-gray-600">by {donation.author}</p>
                <p className="text-sm text-gray-500 mt-1">ISBN: {donation.isbn}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                donation.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {donation.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{donation.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Published Year</p>
                <p className="font-medium">{donation.publishedYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Donor Name</p>
                <p className="font-medium">{donation.donorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Donor Email</p>
                <p className="font-medium">{donation.donorEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Request Date</p>
                <p className="font-medium">{formatDate(donation.createdAt)}</p>
              </div>
            </div>

            {donation.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-800">{donation.description}</p>
              </div>
            )}

            {donation.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleReview(donation, 'approved')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Check size={16} />
                  Accept & Add to Library
                </button>
                <button
                  onClick={() => handleReview(donation, 'rejected')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            )}

            {donation.reviewNotes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Review Notes:</p>
                <p className="text-gray-800">{donation.reviewNotes}</p>
              </div>
            )}
          </div>
        ))}

        {donations.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No {statusFilter} donation requests found.</p>
          </div>
        )}
      </div>

      {showReviewModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedDonation.reviewStatus === 'approved' ? 'Accept' : 'Reject'} Donation
            </h2>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedDonation.title}</p>
              <p className="text-sm text-gray-600">by {selectedDonation.author}</p>
              <p className="text-sm text-gray-600 mt-1">Donor: {selectedDonation.donorName}</p>
            </div>
            
            <form onSubmit={onSubmitReview} className="space-y-4">
              {selectedDonation.reviewStatus === 'approved' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              )}

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
                    selectedDonation.reviewStatus === 'approved'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {selectedDonation.reviewStatus === 'approved' ? 'Accept & Add to Library' : 'Reject'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedDonation(null);
                    setReviewNotes('');
                    setTotalCopies(1);
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

export default DonateBooks;