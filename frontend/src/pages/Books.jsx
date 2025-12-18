import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { booksAPI } from '../services/api';
import { offlineService } from '../services/offlineDB';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const isOnline = useOnlineStatus();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography'];

  useEffect(() => {
    fetchBooks();
  }, [isOnline, searchTerm, selectedCategory]);

  const fetchBooks = async () => {
    try {
      const filters = {
        search: searchTerm,
        category: selectedCategory
      };

      if (isOnline) {
        const response = await booksAPI.getBooks(filters);
        setBooks(response.data.books);
      } else {
        const offlineBooks = await offlineService.getBooks(filters);
        setBooks(offlineBooks);
      }
    } catch (error) {
      toast.error('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingBook) {
        if (isOnline) {
          await booksAPI.updateBook(editingBook.id, data);
        } else {
          await offlineService.updateBook(editingBook.id, data);
        }
        toast.success('Book updated successfully');
      } else {
        if (isOnline) {
          await booksAPI.createBook(data);
        } else {
          await offlineService.addBook(data);
        }
        toast.success('Book added successfully');
      }
      
      setShowModal(false);
      setEditingBook(null);
      reset();
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving book');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    reset(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        if (isOnline) {
          await booksAPI.deleteBook(id);
        } else {
          await offlineService.deleteBook(id);
        }
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        toast.error('Error deleting book');
      }
    }
  };

  const openModal = () => {
    setEditingBook(null);
    reset();
    setShowModal(true);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Books Management</h1>
          <p className="text-gray-600 mt-2">Manage your library's book collection</p>
        </div>
        <button onClick={openModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Book
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ISBN</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Copies</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id || book.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{book.title}</td>
                  <td className="py-3 px-4 text-gray-600">{book.author}</td>
                  <td className="py-3 px-4 text-gray-600">{book.isbn}</td>
                  <td className="py-3 px-4 text-gray-600">{book.category}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {book.availableCopies}/{book.totalCopies}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={book.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id || book.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {books.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No books found. Add some books to get started.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="input-field"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  {...register('author', { required: 'Author is required' })}
                  className="input-field"
                />
                {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  {...register('isbn', { required: 'ISBN is required' })}
                  className="input-field"
                />
                {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                <input
                  type="number"
                  min="1"
                  {...register('totalCopies', { required: 'Total copies is required', min: 1 })}
                  className="input-field"
                />
                {errors.totalCopies && <p className="text-red-500 text-sm">{errors.totalCopies.message}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingBook ? 'Update' : 'Add'} Book
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

export default Books;
