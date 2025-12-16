import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const TestLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'password123') {
      onLogin();
    } else {
      alert('Use admin/password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Library Management</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="password123"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const TestDashboard = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Library Dashboard</h1>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Books</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">25</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Issued Books</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Returned Books</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">42</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">3</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Welcome to Library Management System</h2>
          <p className="text-gray-600 mb-4">
            This is a professional library management system with offline capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📚 Book Management</h3>
              <p className="text-sm text-gray-600">Add, update, delete, and search books</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📋 Issue/Return</h3>
              <p className="text-sm text-gray-600">Track book transactions</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">✅ Approvals</h3>
              <p className="text-sm text-gray-600">Review book donations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function TestApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <TestDashboard onLogout={() => setIsAuthenticated(false)} />
        ) : (
          <TestLogin onLogin={() => setIsAuthenticated(true)} />
        )}
      </div>
    </Router>
  );
}

export default TestApp;