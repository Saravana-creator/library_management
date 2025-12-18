import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

const StudentLogin = ({ onLogin, onBack }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    studentId: '', 
    department: '', 
    semester: '', 
    phone: '' 
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/student-auth/login', credentials);
      localStorage.setItem('token', response.data.token);
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
        <button onClick={onBack} className="mb-4 text-green-600 hover:text-green-800 flex items-center gap-2">
          ← Back to role selection
        </button>
        <h1 className="text-2xl font-bold text-center mb-6">
          {isRegister ? 'Student Registration' : 'Student Login'}
        </h1>
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={registerData.name} 
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" 
                required 
              />
              <input 
                type="text" 
                placeholder="Student ID" 
                value={registerData.studentId} 
                onChange={(e) => setRegisterData({...registerData, studentId: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" 
                required 
              />
              <input 
                type="text" 
                placeholder="Department" 
                value={registerData.department} 
                onChange={(e) => setRegisterData({...registerData, department: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" 
                required 
              />
              <input 
                type="text" 
                placeholder="Semester" 
                value={registerData.semester} 
                onChange={(e) => setRegisterData({...registerData, semester: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" 
                required 
              />
              <input 
                type="tel" 
                placeholder="Phone" 
                value={registerData.phone} 
                onChange={(e) => setRegisterData({...registerData, phone: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg" 
                required 
              />
            </>
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={isRegister ? registerData.email : credentials.email} 
            onChange={(e) => isRegister ? setRegisterData({...registerData, email: e.target.value}) : setCredentials({...credentials, email: e.target.value})} 
            className="w-full px-3 py-2 border rounded-lg" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={isRegister ? registerData.password : credentials.password} 
            onChange={(e) => isRegister ? setRegisterData({...registerData, password: e.target.value}) : setCredentials({...credentials, password: e.target.value})} 
            className="w-full px-3 py-2 border rounded-lg" 
            required 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button 
          onClick={() => setIsRegister(!isRegister)} 
          className="w-full mt-4 text-green-600 hover:text-green-800 text-sm"
        >
          {isRegister ? 'Already have an account? Login' : 'New student? Register'}
        </button>
      </div>
    </div>
  );
};

export default StudentLogin;
