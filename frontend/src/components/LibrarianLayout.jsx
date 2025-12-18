import React from 'react';
import { NavLink } from 'react-router-dom';

const LibrarianLayout = ({ children, onLogout, librarian }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Library System</h1>
        <p className="text-sm text-gray-600">Welcome, {librarian?.username}</p>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          📊 Dashboard
        </NavLink>
        <NavLink 
          to="/books" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          📚 Books
        </NavLink>
        <NavLink 
          to="/issues" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          👥 Issues
        </NavLink>
        <NavLink 
          to="/approvals" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          ✅ Approvals
        </NavLink>
        <NavLink 
          to="/approved-requests" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          📋 Ready for Pickup
        </NavLink>
        <NavLink 
          to="/donate-books" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          🎁 Approve Request to Donate Book
        </NavLink>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <button 
          onClick={onLogout} 
          className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          🚪 Logout
        </button>
      </div>
    </div>
    <main className="flex-1 ml-64 p-8">{children}</main>
  </div>
);

export default LibrarianLayout;
