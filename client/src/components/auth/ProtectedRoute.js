import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // If no token found, redirect to login page
    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    // If token exists, render the protected component
    return children;
};

export default ProtectedRoute;