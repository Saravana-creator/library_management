import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { issuesAPI, booksAPI } from '../services/api';
import { offlineService } from '../services/offlineDB';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  
  const isOnline = useOnlineStatus();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchIssues();
    fetchBooks();
  }, [isOnline, statusFilter]);

  const fetchIssues = async () => {
    try {
      const filters = statusFilter ? { status: statusFilter } : {};
      
      if (isOnline) {
        const response = await issuesAPI.getIssues(filters);
        setIssues(response.data.records);
      } else {
        const offlineIssues = await offlineService.getIssues(filters);
        setIssues(offlineIssues);
      }
    } catch (error) {
      toast.error('Error fetching issues');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      if (isOnline) {
        const response = await booksAPI.getBooks({ limit: 100 });
        setBooks(response.data.books.filter(book => book.availableCopies > 0));
      } else {
        const offlineBooks = await offlineService.getBooks();
        setBooks(offlineBooks.filter(book => book.availableCopies > 0));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const issueData = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString()
      };

      if (isOnline) {
        await issuesAPI.issueBook(issueData);
      } else {
        await offlineService.issueBook(issueData);
      }
      
      toast.success('Book issued successfully');
      setShowModal(false);
      reset();
      fetchIssues();
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error issuing book');
    }
  };

  const handleReturn = async (issueId) => {
    try {
      if (isOnline) {
        await issuesAPI.returnBook(issueId);
      } else {
        await offlineService.returnBook(issueId);
      }
      
      toast.success('Book returned successfully');
      fetchIssues();
      fetchBooks();
    } catch (error) {
      toast.error('Error returning book');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Issue & Return Books</h1>
          <p className="text-gray-600 mt-2">Manage book transactions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Issue Book
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="">All Status</option>
            <option value="issued">Issued</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Book</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Issue Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Return Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => {
                const daysOverdue = getDaysOverdue(issue.dueDate);
                const isOverdue = issue.status === 'issued' && daysOverdue > 0;
                
                return (
                  <tr key={issue._id || issue.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {issue.bookId?.title || 'Unknown Book'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {issue.bookId?.author || 'Unknown Author'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{issue.studentName}</div>
                        <div className="text-sm text-gray-600">{issue.studentId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(issue.issueDate)}</td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(issue.dueDate)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {issue.returnDate ? formatDate(issue.returnDate) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={isOverdue ? 'overdue' : issue.status} />
                        {isOverdue && (
                          <span className="text-xs text-red-600">
                            {daysOverdue} days overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {issue.status === 'issued' && (
                        <button
                          onClick={() => handleReturn(issue._id || issue.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <RotateCcw size={14} />
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {issues.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No issue records found.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Issue Book</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book</label>
                <select
                  {...register('bookId', { required: 'Book selection is required' })}
                  className="input-field"
                >
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book._id || book.id} value={book._id || book.id}>
                      {book.title} - {book.author} (Available: {book.availableCopies})
                    </option>
                  ))}
                </select>
                {errors.bookId && <p className="text-red-500 text-sm">{errors.bookId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  {...register('studentName', { required: 'Student name is required' })}
                  className="input-field"
                />
                {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  {...register('studentId', { required: 'Student ID is required' })}
                  className="input-field"
                />
                {errors.studentId && <p className="text-red-500 text-sm">{errors.studentId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  {...register('dueDate', { required: 'Due date is required' })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Issue Book
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default Issues;