import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      const studentData = JSON.parse(storedStudent);
      setStudent(studentData);
      setFormData({
        name: studentData.name || '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        department: studentData.department || '',
        semester: studentData.semester || ''
      });
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/student/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedStudent = response.data.student;
      setStudent(updatedStudent);
      localStorage.setItem('student', JSON.stringify(updatedStudent));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {isEditing ? 'Save' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="text-lg font-semibold">{student.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="text-lg">{student.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Student ID</label>
            <p className="text-lg text-gray-500">{student.studentId} (Cannot be changed)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Department</label>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="text-lg">{student.department || 'Not specified'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Semester</label>
            {isEditing ? (
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Semester</option>
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            ) : (
              <p className="text-lg">{student.semester || 'Not specified'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="text-lg">{student.phone || 'Not specified'}</p>
            )}
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
