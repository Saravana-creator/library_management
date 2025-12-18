import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Import pages
import LandingPage from './pages/LandingPage';
import AdminLandingPage from './pages/AdminLandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Issues from './pages/Issues';
import Approvals from './pages/Approvals';
import ApprovedRequests from './pages/ApprovedRequests';
import DonateBooks from './pages/DonateBooks';

// Import student components
import StudentLogin from './pages/student/StudentLogin';
import StudentLayout from './components/StudentLayout';
import StudentBrowseBooks from './pages/student/StudentBrowseBooks';
import StudentMyBooks from './pages/student/StudentMyBooks';
import StudentDonateBook from './pages/student/StudentDonateBook';
import StudentProfile from './pages/student/StudentProfile';
import StudentOverdue from './pages/student/StudentOverdue';
import OverdueAlert from './components/OverdueAlert';

// Import librarian components
import LibrarianLayout from './components/LibrarianLayout';

const API_URL = 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('librarian');
      localStorage.removeItem('student');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const RoleSelection = ({ onSelectRole, onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </button>
      )}
      <h1 className="text-2xl font-bold text-center mb-6">Library Management System</h1>
      <p className="text-center text-gray-600 mb-8">Select your role to continue</p>
      <div className="space-y-4">
        <button 
          onClick={() => onSelectRole('librarian')} 
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faBook} /> Librarian Login
        </button>
        <button 
          onClick={() => onSelectRole('student')} 
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faUser} /> Student Portal
        </button>
      </div>
    </div>
  </div>
);

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showAdminLanding, setShowAdminLanding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [librarian, setLibrarian] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token && storedRole && !showLanding && !showAdminLanding && !selectedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
      if (storedRole === 'librarian') {
        const storedLibrarian = localStorage.getItem('librarian');
        if (storedLibrarian) setLibrarian(JSON.parse(storedLibrarian));
      } else if (storedRole === 'student') {
        const storedStudent = localStorage.getItem('student');
        if (storedStudent) setStudent(JSON.parse(storedStudent));
      }
    }
  }, [showLanding, showAdminLanding, selectedRole]);

  const handleGetStarted = () => {
    setShowLanding(false);
    if (showAdminLanding) {
      setShowAdminLanding(false);
      setSelectedRole('librarian');
    } else {
      setSelectedRole('student');
    }
  };

  const handleAdminAccess = () => {
    setShowLanding(false);
    setShowAdminLanding(true);
  };

  const handleBackToUser = () => {
    setShowLanding(true);
    setShowAdminLanding(false);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleLibrarianLogin = (librarianData) => {
    setIsAuthenticated(true);
    setRole('librarian');
    setLibrarian(librarianData);
    localStorage.setItem('role', 'librarian');
  };

  const handleStudentLogin = (studentData) => {
    setIsAuthenticated(true);
    setRole('student');
    setStudent(studentData);
    localStorage.setItem('role', 'student');
  };

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('librarian');
      localStorage.removeItem('student');
      setIsAuthenticated(false);
      setRole(null);
      setSelectedRole(null);
      setLibrarian(null);
      setStudent(null);
      // Redirect to respective landing page
      if (role === 'librarian') {
        setShowAdminLanding(true);
        setShowLanding(false);
      } else {
        setShowLanding(true);
        setShowAdminLanding(false);
      }
    },1000);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
  };

  const handleBackToLanding = () => {
    if (showAdminLanding) {
      setShowAdminLanding(true);
    } else {
      setShowLanding(true);
    }
    setSelectedRole(null);
  };

  return (
    <Router>
      <div className="App">
        {showLanding ? (
          <LandingPage onGetStarted={handleGetStarted} onAdminAccess={handleAdminAccess} />
        ) : showAdminLanding ? (
          <AdminLandingPage onGetStarted={handleGetStarted} onBackToUser={handleBackToUser} />
        ) : !isAuthenticated ? (
          <>
            {selectedRole === 'librarian' ? (
              <Login onLogin={handleLibrarianLogin} onBack={handleBackToLanding} />
            ) : selectedRole === 'student' ? (
              <StudentLogin onLogin={handleStudentLogin} onBack={handleBackToLanding} />
            ) : (
              <RoleSelection onSelectRole={handleSelectRole} onBack={handleBackToLanding} />
            )}
          </>
        ) : role === 'librarian' ? (
          <LibrarianLayout onLogout={handleLogout} librarian={librarian}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/approved-requests" element={<ApprovedRequests />} />
              <Route path="/donate-books" element={<DonateBooks />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </LibrarianLayout>
        ) : (
          <StudentLayout onLogout={handleLogout} student={student}>
            <OverdueAlert />
            <Routes>
              <Route path="/" element={<StudentBrowseBooks />} />
              <Route path="/my-books" element={<StudentMyBooks />} />
              <Route path="/overdue" element={<StudentOverdue />} />
              <Route path="/donate" element={<StudentDonateBook />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </StudentLayout>
        )}
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
