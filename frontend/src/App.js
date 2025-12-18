import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && token !== 'demo-token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const RoleSelection = ({ onSelectRole }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8">Library Management System</h1>
      <div className="space-y-4">
        <button onClick={() => onSelectRole('librarian')} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg">📚 Librarian Login</button>
        <button onClick={() => onSelectRole('student')} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold text-lg">👨🎓 Student Login</button>
      </div>
    </div>
  </div>
);

const LibrarianLogin = ({ onLogin, onBack }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('librarian', JSON.stringify(response.data.librarian));
      localStorage.setItem('role', 'librarian');
      toast.success('Login successful!');
      onLogin('librarian', response.data.librarian);
    } catch (error) {
      toast.error('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-center mb-6">Librarian Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="password" placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">Demo: admin / password123</p>
      </div>
    </div>
  );
};

const StudentAuth = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', studentId: '', phone: '', department: '', semester: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isRegister ? '/student-auth/register' : '/student-auth/login';
      const data = isRegister ? formData : { email: formData.email, password: formData.password };
      const response = await api.post(endpoint, data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('student', JSON.stringify(response.data.student));
      localStorage.setItem('role', 'student');
      toast.success(isRegister ? 'Registration successful!' : 'Login successful!');
      onLogin('student', response.data.student);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button onClick={onBack} className="text-green-600 hover:text-green-800 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-center mb-6">{isRegister ? 'Student Register' : 'Student Login'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="Student ID" value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="number" placeholder="Semester" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </>
          )}
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}</button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="w-full text-center text-green-600 hover:text-green-800 mt-4 text-sm">{isRegister ? 'Already have account? Login' : 'New student? Register'}</button>
      </div>
    </div>
  );
};

const LibrarianLayout = ({ children, onLogout, librarian }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">📚 Library System</h1>
        <p className="text-sm text-gray-600">Librarian: {librarian?.username}</p>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink to="/librarian" end className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>📊 Dashboard</NavLink>
        <NavLink to="/librarian/books" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>📚 Books</NavLink>
        <NavLink to="/librarian/requests" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>📋 Requests</NavLink>
        <NavLink to="/librarian/overdue" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>⚠️ Overdue</NavLink>
        <NavLink to="/librarian/penalties" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>💰 Penalties</NavLink>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <button onClick={onLogout} className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">🚪 Logout</button>
      </div>
    </div>
    <main className="flex-1 ml-64 p-8">{children}</main>
  </div>
);

const StudentLayout = ({ children, onLogout, student }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">📚 Library</h1>
        <p className="text-sm text-gray-600">{student?.name}</p>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink to="/student" end className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>📖 Browse Books</NavLink>
        <NavLink to="/student/my-books" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>📚 My Books</NavLink>
        <NavLink to="/student/profile" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>👤 Profile</NavLink>
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
    api.get('/dashboard/stats').then(r => setStats(r.data.stats)).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Total Books</h3><p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalBooks}</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Issued Books</h3><p className="text-3xl font-bold text-orange-600 mt-2">{stats.issuedBooks}</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Returned Books</h3><p className="text-3xl font-bold text-green-600 mt-2">{stats.returnedBooks}</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3><p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingApprovals}</p></div>
      </div>
    </div>
  );
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });
  
  useEffect(() => { fetchBooks(); }, []);
  
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
      await api.post('/books', {...formData, availableCopies: formData.totalCopies});
      toast.success('Book added');
      fetchBooks();
      setShowModal(false);
      setFormData({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });
    } catch (error) {
      toast.error('Error saving book');
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="text" placeholder="ISBN" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Select Category</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Technology">Technology</option>
              </select>
              <input type="number" placeholder="Total Copies" value={formData.totalCopies} onChange={(e) => setFormData({...formData, totalCopies: e.target.value})} className="w-full px-3 py-2 border rounded-lg" min="1" required />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Add</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const fetchRequests = () => {
    api.get('/librarian/pending-requests').then(r => setRequests(r.data.borrowRequests || [])).catch(() => {});
  };
  const handleApprove = async (requestId) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    try {
      await api.post('/librarian/approve-borrow', { requestId, dueDate: dueDate.toISOString() });
      toast.success('Request approved');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving');
    }
  };
  const handleReject = async (requestId) => {
    try {
      await api.post('/librarian/reject-borrow', { requestId });
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rejecting');
    }
  };
  useEffect(() => { fetchRequests(); }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pending Requests</h1>
      <div className="bg-white rounded-lg shadow p-6">{requests.length === 0 ? <p className="text-gray-600">No pending requests</p> : requests.map(req => <div key={req._id} className="p-4 border-b flex justify-between items-center"><div><p className="font-semibold">{req.studentId?.name}</p><p className="text-sm text-gray-600">{req.bookId?.title}</p></div><div className="flex gap-2"><button onClick={() => handleApprove(req._id)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Approve</button><button onClick={() => handleReject(req._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Reject</button></div></div>)}</div>
    </div>
  );
};

const Overdue = () => {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    api.get('/librarian/overdue-students').then(r => setStudents(r.data.overdueStudents || [])).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overdue Students</h1>
      <div className="bg-white rounded-lg shadow p-6">{students.length === 0 ? <p className="text-gray-600">No overdue students</p> : students.map((s, i) => <div key={i} className="p-4 border-b"><p className="font-semibold">{s.name}</p><p className="text-sm text-red-600">{s.daysOverdue} days overdue</p></div>)}</div>
    </div>
  );
};

const Penalties = () => {
  const [penalties, setPenalties] = useState([]);
  useEffect(() => {
    api.get('/librarian/student-penalties').then(r => setPenalties(r.data.penalties || [])).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Penalties</h1>
      <div className="bg-white rounded-lg shadow p-6">{penalties.map((p, i) => <div key={i} className="p-4 border-b flex justify-between"><p className="font-semibold">{p.name}</p><p className="text-red-600 font-bold">₹{p.totalPenalty}</p></div>)}</div>
    </div>
  );
};

const StudentBrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const handleRequest = async (bookId) => {
    try {
      await api.post('/student/borrow-request', { bookId });
      toast.success('Request submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting request');
    }
  };
  useEffect(() => { api.get('/books').then(r => setBooks(r.data.books || [])).catch(() => {}); }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-500 mt-2">Available: {book.availableCopies}/{book.totalCopies}</p>
            <button onClick={() => handleRequest(book._id)} disabled={book.availableCopies === 0} className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">{book.availableCopies === 0 ? 'Not Available' : 'Request Book'}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const StudentMyBooks = () => <div><h1 className="text-3xl font-bold mb-6">My Books</h1><div className="bg-white rounded-lg shadow p-6"><p className="text-gray-600">No books issued yet</p></div></div>;

const StudentProfile = () => {
  const student = JSON.parse(localStorage.getItem('student') || '{}');
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-md space-y-4">
        <div><p className="text-sm text-gray-600">Name</p><p className="text-lg font-semibold">{student.name}</p></div>
        <div><p className="text-sm text-gray-600">Email</p><p className="text-lg font-semibold">{student.email}</p></div>
        <div><p className="text-sm text-gray-600">Student ID</p><p className="text-lg font-semibold">{student.studentId}</p></div>
      </div>
    </div>
  );
};

function App() {
  const [currentRole, setCurrentRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [librarian, setLibrarian] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const librarianData = localStorage.getItem('librarian');
    const studentData = localStorage.getItem('student');
    if (role === 'librarian' && librarianData) {
      setCurrentRole('librarian');
      setLibrarian(JSON.parse(librarianData));
    } else if (role === 'student' && studentData) {
      setCurrentRole('student');
      setStudent(JSON.parse(studentData));
    }
  }, []);

  const handleLogin = (role, data) => {
    setCurrentRole(role);
    if (role === 'librarian') setLibrarian(data);
    else setStudent(data);
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentRole(null);
    setSelectedRole(null);
    setLibrarian(null);
    setStudent(null);
  };

  if (!currentRole) {
    if (!selectedRole) return <RoleSelection onSelectRole={setSelectedRole} />;
    if (selectedRole === 'librarian') return <LibrarianLogin onLogin={handleLogin} onBack={() => setSelectedRole(null)} />;
    if (selectedRole === 'student') return <StudentAuth onLogin={handleLogin} onBack={() => setSelectedRole(null)} />;
  }

  return (
    <Router>
      <div className="App">
        {currentRole === 'librarian' ? (
          <LibrarianLayout onLogout={handleLogout} librarian={librarian}>
            <Routes>
              <Route path="/librarian" element={<Dashboard />} />
              <Route path="/librarian/books" element={<Books />} />
              <Route path="/librarian/requests" element={<Requests />} />
              <Route path="/librarian/overdue" element={<Overdue />} />
              <Route path="/librarian/penalties" element={<Penalties />} />
              <Route path="*" element={<Navigate to="/librarian" />} />
            </Routes>
          </LibrarianLayout>
        ) : (
          <StudentLayout onLogout={handleLogout} student={student}>
            <Routes>
              <Route path="/student" element={<StudentBrowseBooks />} />
              <Route path="/student/my-books" element={<StudentMyBooks />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="*" element={<Navigate to="/student" />} />
            </Routes>
          </StudentLayout>
        )}
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
