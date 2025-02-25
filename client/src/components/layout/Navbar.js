import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ user }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };


    return (
        <nav className="max-w-screen-xl w-full mx-auto bg-white px-4 sm:px-6 lg:px-8 shadow-md rounded-b-lg">
            <div className="flex justify-between h-16">
                {/* Left side - Logo/Name */}
                <div className="flex-shrink-0 flex items-center">
                    <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
                        AcadAI
                    </Link>
                </div>

                {/* Right side - Profile Menu */}
                <div className="flex items-center">
                    <div className="relative ml-3">
                        <button
                            onClick={toggleDropdown}
                            className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <img
                                className="h-8 w-8 rounded-full object-cover"
                                src={user?.avatar || '/default-avatar.png'}
                                alt={user?.name}
                                onError={(e) => {
                                    e.target.src = '/default-avatar.png';
                                }}
                            />
                        </button>



                        {/* Dropdown menu */}
                        {showDropdown && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <Link
                                    to="/settings"
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    onClick={() => setShowDropdown(false)}

                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    Settings
                                </Link>
                                <Link
                                    to="/logout"
                                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
