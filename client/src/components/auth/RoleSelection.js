import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = ({ user, updateUser }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRoleSelect = async (selectedRole) => {
        try {
            setIsLoading(true);

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/auth/google/role`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ role: selectedRole })
            });

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data || 'Failed to update role');
            }

            const updatedUser = { ...user, role: selectedRole };
            updateUser(updatedUser);

            navigate('/');
        } catch (error) {
            navigate('/?error=role_selection_failed&message=' + encodeURIComponent(error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-indigo-600 mb-2">Welcome to AcadAI!</h1>
                    <p className="mt-2 text-gray-600">
                        Choose your role to get started
                    </p>
                    <p className="mt-4 text-sm text-red-500 font-medium">
                        ⚠️ Please choose carefully - this cannot be changed later
                    </p>
                </div>

                <div className="mt-8 flex space-x-4">
                    <button
                        onClick={() => handleRoleSelect('student')}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center px-2 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        Student
                    </button>
                    <button
                        onClick={() => handleRoleSelect('instructor')}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center px-2 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                        Instructor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection; 