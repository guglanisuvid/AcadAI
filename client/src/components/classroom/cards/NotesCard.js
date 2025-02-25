import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiType } from 'react-icons/fi';
import DeleteConfirmationModal from '../../modals/DeleteConfirmationModal';
import EditNotesTitleModal from '../../modals/EditNotesTitleModal';

const NotesCard = ({ setError, note, onDelete, onNotesUpdate }) => {
    const [showEditTitleModal, setShowEditTitleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/notes/${note._id}/delete`,
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
                setError(data.message || 'Failed to delete resource');
                return;
            }

            onDelete(note._id);
            setShowDeleteModal(false);
        } catch (error) {
            setError('Error deleting resource');
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
                <div className='flex justify-between items-center'>
                    <div className="flex gap-2 items-center">
                        <FiType className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {note?.title}
                        </h3>
                    </div>
                    <motion.button
                        onClick={() => setShowEditTitleModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                    >
                        <FiEdit2 className="w-4 h-4" />
                    </motion.button>
                </div>

                <p className="text-sm text-gray-600 line-clamp-1">
                    {
                        new Date(note?.createdAt).toLocaleString('en-US', {
                            timeZone: 'Asia/Kolkata',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })
                    }
                </p>

                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/notes/${note._id}`)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                    >
                        <FiEdit2 className="w-4 h-4 mr-1.5" />
                        Edit Content
                    </motion.button>

                    <motion.button
                        onClick={() => setShowDeleteModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                    >
                        <FiTrash2 className="w-4 h-4 mr-1.5" />
                        Delete
                    </motion.button>

                </div>
            </motion.div >

            <EditNotesTitleModal
                isOpen={showEditTitleModal}
                onClose={() => setShowEditTitleModal(false)}
                note={note}
                onNotesUpdate={onNotesUpdate}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title={`Delete "${note?.title}"`}
                message={
                    "Are you sure you want to delete the selected notes?"
                }
            />
        </>
    );
};

export default NotesCard; 