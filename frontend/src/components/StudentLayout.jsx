import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faExclamationTriangle, faGift, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const StudentLayout = ({ children, onLogout, student }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
        <p className="text-sm text-gray-600">Welcome, {student?.name}</p>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FontAwesomeIcon icon={faBook} className="mr-2" /> Browse Books
        </NavLink>
        <NavLink 
          to="/my-books" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FontAwesomeIcon icon={faBookOpen} className="mr-2" /> My Books
        </NavLink>
        <NavLink 
          to="/overdue" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" /> Overdue
        </NavLink>
        <NavLink 
          to="/donate" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FontAwesomeIcon icon={faGift} className="mr-2" /> Donate Book
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `block px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
        </NavLink>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <button 
          onClick={onLogout} 
          className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
        </button>
      </div>
    </div>
    <main className="flex-1 ml-64 p-8">{children}</main>
  </div>
);

export default StudentLayout;
