import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import DeleteConfirmationModal from '../../modals/DeleteConfirmationModal';

const NotesCard = ({ setError, discussion, onDelete, userId, isInstructor }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/discussions/${discussion._id}/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                setError(data.message || 'Failed to delete discussion');
                return;
            }

            onDelete(discussion._id);
            setShowDeleteModal(false);
        } catch (error) {
            setError('Error deleting discussion');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="h-full flex flex-col justify-between gap-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
                <div className="flex gap-2 items-center">
                    <FiActivity className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {discussion?.question}
                    </h3>
                </div>

                <p className="text-sm text-gray-600 line-clamp-1 flex gap-2 items-center">

                    <img
                        className="h-6 w-6 rounded-full object-cover"
                        src={discussion?.askedBy?.avatar || '/default-avatar.png'}
                        alt={discussion?.askedBy?.name}
                        onError={(e) => {
                            e.target.src = '/default-avatar.png';
                        }}
                    />
                    <span>{discussion?.askedBy?.name}</span>
                </p>

                <p className="text-sm text-gray-600 line-clamp-1 flex gap-2 items-center">
                    <FiCalendar className="w-5 h-5" />
                    <span>Created on {' '}
                        {
                            new Date(discussion?.createdAt).toLocaleString('en-US', {
                                timeZone: 'Asia/Kolkata',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })
                        }
                    </span>
                </p>

                <div className="flex items-center gap-3">
                    {/* See Discussion Button */}
                    <motion.button
                        onClick={() => navigate(`/discussions/${discussion?._id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                        See Discussion
                    </motion.button>

                    {/* Delete Discussion Button */}
                    {(userId === discussion?.askedBy?._id || isInstructor) && <motion.button
                        onClick={() => setShowDeleteModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                    >
                        <FiTrash2 className="w-4 h-4 mr-1.5" />
                        Delete
                    </motion.button>}
                </div>
            </motion.div >

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title={`Delete Discussion`}
                message={
                    "Are you sure you want to delete the selected discussion? All the answers will be deleted and everyone else will lose access to this discussion."
                }
            />
        </>
    );
};

export default NotesCard; 