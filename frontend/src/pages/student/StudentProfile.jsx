import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <p className="text-lg font-semibold">{student.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg">{student.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Student ID</label>
            <p className="text-lg">{student.studentId}</p>
          </div>
          
          {student.department && (
            <div>
              <label className="block text-sm font-medium text-gray-600">Department</label>
              <p className="text-lg">{student.department}</p>
            </div>
          )}
          
          {student.semester && (
            <div>
              <label className="block text-sm font-medium text-gray-600">Semester</label>
              <p className="text-lg">{student.semester}</p>
            </div>
          )}
          
          {student.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <p className="text-lg">{student.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
