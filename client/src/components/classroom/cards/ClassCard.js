import React, { useState, useRef, useEffect } from 'react';
import { FiCopy, FiUsers, FiMoreVertical, FiTrash2, FiLogOut, FiEdit } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ClassCard = ({ classItem, onCopyCode, isInstructor, onDelete, onLeave, onEdit, onAction }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action) => {
        onAction(action, classItem._id);
    };

    const handleCardClick = (e) => {
        // Don't navigate if clicking menu or buttons
        if (e.target.closest('.card-actions')) return;
        navigate(`/classes/${classItem._id}`);
    };

    return (
        <motion.div
            onClick={handleCardClick}
            className="flex flex-col gap-4 justify-between bg-white rounded-lg shadow-md p-6 
                     hover:shadow-lg transition-all duration-100 cursor-pointer relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Top Menu */}
            <div className="card-actions flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 pr-8">
                    {classItem.title}
                </h2>
                <div ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiMoreVertical size={20} className="text-gray-500" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                            >
                                {isInstructor ? (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(classItem);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                        >
                                            <FiEdit className="mr-2" />
                                            Edit Class
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAction('Delete Class');
                                            }}
                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                        >
                                            <FiTrash2 className="mr-2" />
                                            Delete Class
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction('Leave Class');
                                        }}
                                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <FiLogOut className="mr-2" />
                                        Leave Class
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <p className="text-gray-600 line-clamp-2">
                {classItem.description}
            </p>

            <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                    <FiUsers className="mr-2" />
                    <span>{classItem.students?.length || 0} {classItem.students?.length === 1 ? "student" : "students"}</span>
                </div>
                {isInstructor && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            Code: {classItem.classCode}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCopyCode(classItem.classCode);
                            }}
                            className="text-gray-500 hover:text-indigo-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                            title="Copy class code"
                        >
                            <FiCopy size={16} />
                        </button>
                    </div>)}
            </div>
        </motion.div>
    );
};

export default ClassCard; 