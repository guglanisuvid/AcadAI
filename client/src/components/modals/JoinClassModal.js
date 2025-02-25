import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiX, FiHash } from 'react-icons/fi';
import Modal from '../common/Modal';

const JoinClassModal = ({ isOpen, onClose, onJoinClass }) => {
    const [classCode, setClassCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/classes/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    classCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to join class');
            }

            onJoinClass(data);
            onClose();
            setClassCode('');
        } catch (error) {
            setError(error.message || 'Failed to join class. Please check the class code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative"
            >
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FiUserPlus className="mr-2" />
                        Join Class
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FiHash className="mr-2" />
                            Class Code
                        </label>
                        <input
                            type="text"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                            required
                            placeholder="Enter class code"
                            autoFocus
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Enter the class code provided by your instructor
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !classCode.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <motion.div
                                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"
                                />
                            ) : (
                                'Join Class'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </Modal>
    );
};

export default JoinClassModal; 