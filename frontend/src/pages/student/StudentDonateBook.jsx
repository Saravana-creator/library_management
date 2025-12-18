import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const StudentDonateBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    publishedYear: ''
  });

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const student = JSON.parse(localStorage.getItem('student'));
      const donationData = {
        ...formData,
        donorName: student?.name || 'Anonymous',
        donorEmail: student?.email || 'no-email@example.com'
      };
      console.log('Submitting donation:', donationData);
      const response = await api.post('/approvals', donationData);
      console.log('Donation response:', response.data);
      toast.success('Book donation request submitted successfully');
      setFormData({ title: '', author: '', isbn: '', category: '', description: '', publishedYear: '' });
    } catch (error) {
      console.error('Donation submission error:', error);
      toast.error('Failed to submit donation request');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Donate a Book</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Book Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({...formData, isbn: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Published Year</label>
            <input
              type="number"
              value={formData.publishedYear}
              onChange={(e) => setFormData({...formData, publishedYear: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows="4"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Submit Donation Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentDonateBook;
