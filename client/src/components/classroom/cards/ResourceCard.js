import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFile, FiTrash2 } from 'react-icons/fi';
import DeleteConfirmationModal from '../../modals/DeleteConfirmationModal';

const ResourceCard = ({ setError, resource, isInstructor, onDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/uploads/${resource.file}`);
            const blob = await response.blob();

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = resource.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError('Error downloading file');
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(
                `${API_URL}/api/resources/${resource._id}/delete`,
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

            onDelete(resource._id);
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
                className="h-full flex flex-col justify-between gap-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
                <div className="flex gap-2 items-center">
                    <FiFile className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {resource?.title}
                    </h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {resource?.description}
                </p>
                <div className="flex items-center gap-3">
                    {resource?.file && (
                        <motion.button
                            onClick={handleDownload}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                        >
                            <FiDownload className="w-4 h-4 mr-1.5" />
                            Download
                        </motion.button>
                    )}
                    {isInstructor && (
                        <motion.button
                            onClick={() => setShowDeleteModal(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                        >
                            <FiTrash2 className="w-4 h-4 mr-1.5" />
                            Delete
                        </motion.button>
                    )}
                </div>
            </motion.div>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title={`Delete "${resource?.title}"`}
                message={
                    "Are you sure you want to delete this resource?\n\n" +
                    "This action cannot be undone and students will no longer have access to this resource."
                }
            />
        </>
    );
};

export default ResourceCard; 