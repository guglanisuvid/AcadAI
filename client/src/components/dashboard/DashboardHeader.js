import React, { useState } from 'react';
import { FiSearch, FiPlus, FiUserPlus, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CreateClassModal from '../modals/CreateClassModal';
import JoinClassModal from '../modals/JoinClassModal';

const DashboardHeader = ({ isInstructor, onSearch, onCreateClass, onJoinClass }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-6 my-3">
            {/* Title Section */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                    My Classes
                </h1>
                <p className="text-sm text-green-700 my-1 font-medium">
                    {isInstructor
                        ? 'Manage and create your virtual classrooms'
                        : 'View and join your enrolled classes'}
                </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-indigo-300 group-hover:text-indigo-500 group-focus-within:text-indigo-500 transition-colors duration-200" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 block w-full h-10 rounded-md 
                                 border border-indigo-100 
                                 bg-white/80 text-indigo-900
                                 transition-all duration-200
                                 hover:border-indigo-300
                                 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400
                                 outline-none shadow-sm"
                        placeholder="Search classes by name..."
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                onSearch('');
                            }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300 hover:text-indigo-500"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
                <motion.button
                    onClick={() => isInstructor ? setIsCreateModalOpen(true) : setIsJoinModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 
                             bg-gradient-to-r from-indigo-600 to-indigo-500 
                             text-white rounded-md 
                             hover:from-indigo-500 hover:to-indigo-400 
                             transition-all duration-200 shadow-md
                             border border-indigo-400/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isInstructor ? (
                        <>
                            <FiPlus className="mr-2 h-5 w-5" />
                            Create New Class
                        </>
                    ) : (
                        <>
                            <FiUserPlus className="mr-2 h-5 w-5" />
                            Join Class
                        </>
                    )}
                </motion.button>
            </div>

            {/* Modals */}
            {isInstructor ? (
                <CreateClassModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreateClass={(newClass) => {
                        onCreateClass(newClass);
                        setIsCreateModalOpen(false);
                    }}
                />
            ) : (
                <JoinClassModal
                    isOpen={isJoinModalOpen}
                    onClose={() => setIsJoinModalOpen(false)}
                    onJoinClass={(joinedClass) => {
                        onJoinClass(joinedClass);
                        setIsJoinModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default DashboardHeader; 