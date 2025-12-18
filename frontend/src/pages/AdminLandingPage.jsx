import React from 'react';
import { BookOpen, Users, Clock, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const AdminLandingPage = ({ onGetStarted, onBackToUser }) => {
  const features = [
    {
      icon: BookOpen,
      title: "Digital Catalog",
      description: "Comprehensive book management with search and categorization"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Separate portals for librarians and students with role-based access"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track book issues, returns, and overdue notifications instantly"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "JWT authentication and secure data management"
    }
  ];

  const benefits = [
    "Streamlined book issuing and return process",
    "Automated overdue notifications and penalties",
    "Book donation request management",
    "Offline-first architecture for uninterrupted service",
    "Professional dashboard with analytics",
    "Mobile-responsive design"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">LibraryMS Admin</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onBackToUser}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                ← Back to User Portal
              </button>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Library
            <span className="text-blue-600"> Administration Portal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive library management tools for administrators. 
            Manage books, track issues, handle returns, and oversee all library operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Access Admin Dashboard
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Administrative Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools for efficient library administration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Administrative Capabilities
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Administrator Access</h3>
                <p className="text-gray-600 mb-6">
                  Secure login for library administrators with full system access and management capabilities.
                </p>
                <button
                  onClick={onGetStarted}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login as Administrator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold">LibraryMS Admin</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Administrative Portal - Library Management System
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500">
                © 2024 LibraryMS. All rights reserved. Built with React & Node.js
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLandingPage;