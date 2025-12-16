import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { approvalsAPI } from '../services/api';
import { offlineService } from '../services/offlineDB';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  
  const isOnline = useOnlineStatus();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchApprovals();
  }, [isOnline, statusFilter]);

  const fetchApprovals = async () => {
    try {
      const filters = { status: statusFilter };
      
      if (isOnline) {
        const response = await approvalsAPI.getApprovals(filters);
        setApprovals(response.data.requests);
      } else {
        const offlineApprovals = await offlineService.getApprovals(filters);
        setApprovals(offlineApprovals);
      }
    } catch (error) {
      toast.error('Error fetching approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (approval, status) => {
    setSelectedApproval({ ...approval, reviewStatus: status });
    setShowReviewModal(true);
  };

  const onSubmitReview = async (data) => {
    try {
      const reviewData = {
        status: selectedApproval.reviewStatus,
        reviewNotes: data.reviewNotes
      };

      if (isOnline) {
        await approvalsAPI.reviewApproval(selectedApproval._id || selectedApproval.id, reviewData);
      } else {
        await offlineService.reviewApproval(selectedApproval._id || selectedApproval.id, reviewData);
      }
      
      toast.success(`Book ${selectedApproval.reviewStatus} successfully`);
      setShowReviewModal(false);
      setSelectedApproval(null);
      reset();
      fetchApprovals();
    } catch (error) {
      toast.error('Error reviewing approval');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book Approvals</h1>
        <p className="text-gray-600 mt-2">Review and approve book donation requests</p>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {approvals.map((approval) => (
          <div key={approval._id || approval.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{approval.title}</h3>
                <p className="text-gray-600">by {approval.author}</p>
              </div>
              <StatusBadge status={approval.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">ISBN</p>
                <p className="font-medium">{approval.isbn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{approval.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Published Year</p>
                <p className="font-medium">{approval.publishedYear || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted Date</p>
                <p className="font-medium">{formatDate(approval.createdAt)}</p>
              </div>
            </div>

            {approval.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-800">{approval.description}</p>
              </div>
            )}

            {approval.donorName && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Donor Information</p>
                <p className="font-medium">{approval.donorName}</p>
                {approval.donorEmail && (
                  <p className="text-gray-600">{approval.donorEmail}</p>
                )}
              </div>
            )}

            {approval.reviewNotes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Review Notes</p>
                <p className="text-gray-800">{approval.reviewNotes}</p>
                {approval.reviewDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed on {formatDate(approval.reviewDate)}
                  </p>
                )}
              </div>
            )}

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
          <div className="card text-center py-8">
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
              <p className="font-medium">{selectedApproval.title}</p>
              <p className="text-sm text-gray-600">by {selectedApproval.author}</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Notes {selectedApproval.reviewStatus === 'rejected' && '(Required)'}
                </label>
                <textarea
                  {...register('reviewNotes', {
                    required: selectedApproval.reviewStatus === 'rejected' ? 'Review notes are required for rejection' : false
                  })}
                  rows={4}
                  className="input-field"
                  placeholder="Add your review notes..."
                />
                {errors.reviewNotes && (
                  <p className="text-red-500 text-sm">{errors.reviewNotes.message}</p>
                )}
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
                    reset();
                  }}
                  className="btn-secondary flex-1"
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