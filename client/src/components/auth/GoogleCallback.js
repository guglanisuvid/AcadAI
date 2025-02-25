import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = ({ updateUser }) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);
    const processedRef = useRef(false); // To prevent double processing

    useEffect(() => {
        const processAuth = async () => {
            // If already processed, return early
            if (processedRef.current) return;
            processedRef.current = true;

            try {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const error = urlParams.get('error');

                if (error) {
                    throw new Error(error);
                }

                if (!code) {
                    throw new Error('No authorization code received');
                }

                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/auth/google/callback`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to authenticate');
                }

                if (!data.success || !data.token || !data.user) {
                    throw new Error('Invalid response from server');
                }

                localStorage.setItem('token', data.token);
                updateUser(data.user);

                setIsProcessing(false);

                if (data.user.role) {
                    navigate('/dashboard', { replace: true });
                } else {
                    navigate('/role-selection', { replace: true });
                }
            } catch (error) {
                console.error('Auth error:', error);
                navigate('/login?error=' + encodeURIComponent(error.message), { replace: true });
            }
        };

        processAuth();
    }, [navigate]);

    if (!isProcessing) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Completing sign in...</h2>
                <p className="text-gray-600 mt-2">Please wait while we process your login.</p>
            </div>
        </div>
    );
};

export default GoogleCallback; 