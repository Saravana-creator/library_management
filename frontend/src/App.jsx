import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import api from './api';
import { StudentLayout, StudentBrowseBooks, StudentMyBooks, StudentDonateBook, StudentProfile } from './StudentComponents';
import { LibrarianRequests, OverdueStudents, StudentPenalties } from './LibrarianComponents';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'librarian');
      localStorage.setItem('librarian', JSON.stringify(response.data.librarian));
      toast.success('Login successful!');
      onLogin(response.data.librarian);
    } catch (error) {
      toast.error('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Librarian Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="password" placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
};

const Layout = ({ children, onLogout, librarian }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Library System</h1>
        <p className="text-sm text-gray-600">Welcome, {librarian?.username}</p>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink to="/" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>📊 Dashboard</NavLink>
        <NavLink to="/books" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>📚 Books</NavLink>
        <NavLink to="/requests" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>📋 Requests</NavLink>
        <NavLink to="/overdue" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>⚠️ Overdue</NavLink>
        <NavLink to="/penalties" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>💰 Penalties</NavLink>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <button onClick={onLogout} className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">🚪 Logout</button>
      </div>
    </div>
    <main className="flex-1 ml-64 p-8">{children}</main>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalBooks: 0, issuedBooks: 0, returnedBooks: 0, pendingApprovals: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Books</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalBooks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Issued Books</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.issuedBooks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Returned Books</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.returnedBooks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingApprovals}</p>
        </div>
      </div>
    </div>
  );
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data.books || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, formData);
        toast.success('Book updated successfully');
      } else {
        await api.post('/books', {...formData, availableCopies: formData.totalCopies});
        toast.success('Book added successfully');
      }
      fetchBooks();
      setShowModal(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });
    } catch (error) {
      toast.error('Error saving book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        toast.success('Book deleted');
        fetchBooks();
      } catch (error) {
        toast.error('Error deleting book');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Books Management</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Add Book</button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Copies</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.map(book => (
              <tr key={book._id}>
                <td className="px-6 py-4 font-medium">{book.title}</td>
                <td className="px-6 py-4 text-gray-600">{book.author}</td>
                <td className="px-6 py-4 text-gray-600">{book.isbn}</td>
                <td className="px-6 py-4 text-gray-600">{book.category}</td>
                <td className="px-6 py-4 text-gray-600">{book.availableCopies}/{book.totalCopies}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => {setEditingBook(book); setFormData(book); setShowModal(true);}} className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => handleDelete(book._id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingBook ? 'Edit' : 'Add'} Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="ISBN" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Select Category</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Technology">Technology</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
              </select>
              <input type="number" placeholder="Total Copies" value={formData.totalCopies} onChange={(e) => setFormData({...formData, totalCopies: e.target.value})} className="w-full px-3 py-2 border rounded-lg" min="1" required />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">{editingBook ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => {setShowModal(false); setEditingBook(null); setFormData({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });}} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const RoleSelection = ({ onSelectRole }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Library Management System</h1>
      <div className="space-y-4">
        <button onClick={() => onSelectRole('librarian')} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">📚 Librarian Login</button>
        <button onClick={() => onSelectRole('student')} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">👤 Student Login</button>
      </div>
    </div>
  </div>
);

const StudentLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', studentId: '', department: '', semester: '', phone: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/student-auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'student');
      localStorage.setItem('student', JSON.stringify(response.data.student));
      toast.success('Login successful!');
      onLogin(response.data.student);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/student-auth/register', registerData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'student');
      localStorage.setItem('student', JSON.stringify(response.data.student));
      toast.success('Registration successful!');
      onLogin(response.data.student);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">{isRegister ? 'Student Registration' : 'Student Login'}</h1>
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <>
              <input type="text" placeholder="Full Name" value={registerData.name} onChange={(e) => setRegisterData({...registerData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="Student ID" value={registerData.studentId} onChange={(e) => setRegisterData({...registerData, studentId: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="Department" value={registerData.department} onChange={(e) => setRegisterData({...registerData, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="Semester" value={registerData.semester} onChange={(e) => setRegisterData({...registerData, semester: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="tel" placeholder="Phone" value={registerData.phone} onChange={(e) => setRegisterData({...registerData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
            </>
          )}
          <input type="email" placeholder="Email" value={isRegister ? registerData.email : credentials.email} onChange={(e) => isRegister ? setRegisterData({...registerData, email: e.target.value}) : setCredentials({...credentials, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="password" placeholder="Password" value={isRegister ? registerData.password : credentials.password} onChange={(e) => isRegister ? setRegisterData({...registerData, password: e.target.value}) : setCredentials({...credentials, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}</button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-4 text-green-600 hover:text-green-800 text-sm">{isRegister ? 'Already have an account? Login' : 'New student? Register'}</button>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [librarian, setLibrarian] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token && storedRole) {
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
  }, []);

  const handleSelectRole = (selectedRole) => {
    setSelectedRole(selectedRole);
  };

  const handleLibrarianLogin = (librarianData) => {
    setIsAuthenticated(true);
    setRole('librarian');
    setLibrarian(librarianData);
  };

  const handleStudentLogin = (studentData) => {
    setIsAuthenticated(true);
    setRole('student');
    setStudent(studentData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('librarian');
    localStorage.removeItem('student');
    setIsAuthenticated(false);
    setRole(null);
    setSelectedRole(null);
    setLibrarian(null);
    setStudent(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        {!selectedRole ? (
          <RoleSelection onSelectRole={handleSelectRole} />
        ) : selectedRole === 'librarian' ? (
          <Login onLogin={handleLibrarianLogin} />
        ) : (
          <StudentLogin onLogin={handleStudentLogin} />
        )}
        <Toaster position="top-right" />
      </div>
    );
  }

  if (role === 'librarian') {
    return (
      <Layout onLogout={handleLogout} librarian={librarian}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/requests" element={<LibrarianRequests />} />
          <Route path="/overdue" element={<OverdueStudents />} />
          <Route path="/penalties" element={<StudentPenalties />} />
        </Routes>
        <Toaster position="top-right" />
      </Layout>
    );
  }

  return (
    <StudentLayout onLogout={handleLogout} student={student}>
      <Routes>
        <Route path="/" element={<StudentBrowseBooks />} />
        <Route path="/my-books" element={<StudentMyBooks />} />
        <Route path="/donate" element={<StudentDonateBook />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Routes>
      <Toaster position="top-right" />
    </StudentLayout>
  );
}

export default App;
