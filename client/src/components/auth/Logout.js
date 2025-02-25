import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = () => {
            try {
                // Clear all stored data
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                sessionStorage.clear();

                // Redirect to login page
                navigate('/?message=Successfully logged out');
            } catch (error) {
                navigate('/?error=Logout failed');
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Logging out...</h2>
                <p className="mt-2 text-gray-600">Please wait while we sign you out.</p>
            </div>
        </div>
    );
};

export default Logout; 