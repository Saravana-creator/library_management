import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Try online login first
      const response = await authAPI.login(data);
      login(response.data.token, response.data.librarian);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      // Fallback to offline demo login
      if (data.username === 'admin' && data.password === 'password123') {
        const demoLibrarian = {
          id: 'demo-id',
          username: 'admin',
          email: 'admin@library.com',
          role: 'librarian'
        };
        login('demo-token', demoLibrarian);
        toast.success('Login successful (Offline Mode)!');
        navigate('/');
      } else {
        toast.error('Invalid credentials. Use admin/password123 for demo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <BookOpen className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-2">Sign in to your librarian account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="input-field"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="input-field"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Demo credentials: <strong>admin</strong> / <strong>password123</strong>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Works offline if backend is not running
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
