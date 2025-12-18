import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSearch, faHeart, faBell, faCheckCircle, faArrowRight, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const LandingPage = ({ onGetStarted, onAdminAccess }) => {
  const features = [
    {
      icon: faSearch,
      title: "Browse Books",
      description: "Search and discover books from our extensive digital catalog"
    },
    {
      icon: faBook,
      title: "Request Books",
      description: "Easy book borrowing with instant approval notifications"
    },
    {
      icon: faHeart,
      title: "Donate Books",
      description: "Contribute to the library by donating your books"
    },
    {
      icon: faBell,
      title: "Smart Notifications",
      description: "Get timely reminders for due dates and book availability"
    }
  ];

  const benefits = [
    "Browse thousands of books online",
    "Request books with one-click borrowing",
    "Track your borrowed books and due dates",
    "Receive overdue notifications and alerts",
    "Donate books to expand the library collection",
    "Access your reading history and profile"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <FontAwesomeIcon icon={faBook} className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">LibraryMS</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onAdminAccess}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Admin Portal
              </button>
              <button
                onClick={onGetStarted}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Digital
            <span className="text-green-600"> Library Experience</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover, borrow, and manage your favorite books with ease. 
            Access thousands of books, track your reading, and contribute to our growing collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Reading Today
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <button
              onClick={onAdminAccess}
              className="border-2 border-gray-400 text-gray-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Admin Access
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Reading Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover, borrow, and enjoy books with our user-friendly platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={feature.icon} className="text-green-600 text-2xl" />
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
                Why Students Love Our Library?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faUserPlus} className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Library Community</h3>
                <p className="text-gray-600 mb-6">
                  Create your account and start exploring thousands of books available for borrowing.
                </p>
                <button
                  onClick={onGetStarted}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Create Student Account
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
              <div className="bg-green-600 p-2 rounded-lg">
                <FontAwesomeIcon icon={faBook} className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold">LibraryMS</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Your Digital Library - Connecting readers with books worldwide
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

export default LandingPage;