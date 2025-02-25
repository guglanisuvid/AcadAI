import React, { useState } from 'react';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const url = `${API_URL}/api/auth/google/url`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error('Server returned invalid JSON');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get authentication URL');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No redirect URL received from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to initialize login. Please try again.');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                {/* Logo and Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-indigo-600 mb-2">AcadAI</h1>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Welcome to Your Learning Journey
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Sign in to access your personalized learning experience
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Login Button */}
                <div className="mt-8">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                            ${isLoading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'} 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            {/* Google Icon */}
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                />
                            </svg>
                        </span>
                        {isLoading ? 'Connecting...' : 'Continue with Google'}
                    </button>
                </div>

                {/* Features Preview */}
                <div className="mt-10">
                    <div className="border-t pt-6">
                        <h3 className="text-center text-gray-600 font-medium mb-4">
                            What you'll get access to:
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {[
                                'Live Virtual Classes',
                                'Smart Notes',
                                'AI-Powered Learning',
                                'Interactive Quizzes'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2 text-gray-600">
                                    <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;