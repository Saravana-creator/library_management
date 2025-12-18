import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from './api';

export const StudentLayout = ({ children, onLogout, student }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Library</h1>
        <p className="text-sm text-gray-600">{student?.name}</p>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink to="/" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>📚 Browse</NavLink>
        <NavLink to="/my-books" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>📖 My Books</NavLink>
        <NavLink to="/donate" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>🎁 Donate</NavLink>
        <NavLink to="/profile" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>👤 Profile</NavLink>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <button onClick={onLogout} className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
      </div>
    </div>
    <main className="flex-1 ml-64 p-8">{children}</main>
  </div>
);

export const StudentBrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data.books || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-500 mt-2">ISBN: {book.isbn}</p>
            <p className="text-sm text-gray-500">Category: {book.category}</p>
            <p className="text-sm mt-2">Available: <span className="font-semibold text-green-600">{book.availableCopies}/{book.totalCopies}</span></p>
            <button disabled={book.availableCopies === 0} className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">Request</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StudentMyBooks = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">My Books</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">No books issued yet</p>
    </div>
  </div>
);

export const StudentDonateBook = () => {
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '', category: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/student/donate-book', formData);
      toast.success('Donation submitted');
      setFormData({ title: '', author: '', isbn: '', category: '' });
    } catch (error) {
      toast.error('Error submitting donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Donate a Book</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="text" placeholder="ISBN" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required>
            <option value="">Select Category</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Technology">Technology</option>
          </select>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
    </div>
  );
};

export const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) setStudent(JSON.parse(storedStudent));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {student && (
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <div className="space-y-3">
            <div><label className="text-gray-600 text-sm">Name</label><p className="font-semibold">{student.name}</p></div>
            <div><label className="text-gray-600 text-sm">Email</label><p className="font-semibold">{student.email}</p></div>
            <div><label className="text-gray-600 text-sm">Student ID</label><p className="font-semibold">{student.studentId}</p></div>
            <div><label className="text-gray-600 text-sm">Department</label><p className="font-semibold">{student.department}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};
