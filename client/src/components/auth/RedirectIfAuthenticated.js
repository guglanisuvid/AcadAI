import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectIfAuthenticated = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RedirectIfAuthenticated; 