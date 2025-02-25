import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiFile, FiUpload, FiX, FiType, FiAlignLeft } from 'react-icons/fi';
import Modal from '../common/Modal';

const AddResourceModal = ({ isOpen, onClose, onSuccess, classId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!classId) {
                throw new Error('Class ID is missing');
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('classId', classId);
            formData.append('file', file);

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/resources/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create resource');
            }

            onSuccess(data.resource);
            onClose();
            setTitle('');
            setDescription('');
            setFile(null);
        } catch (error) {
            setError(error.message);
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
                        <FiFile className="mr-2" />
                        Add Resource
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
                            <FiType className="mr-2" />
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                            required
                            placeholder="Enter resource title"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FiAlignLeft className="mr-2" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                            rows={3}
                            required
                            placeholder="Enter resource description"
                            style={{ resize: 'none' }}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FiUpload className="mr-2" />
                            File
                        </label>
                        <div
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${dragActive ? 'border-indigo-500' : 'border-gray-300'
                                } border-dashed rounded-md transition-colors duration-200`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="sr-only"
                                            accept=".pdf,.doc,.docx"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {file ? file.name : 'PDF, DOC, DOCX up to 10MB'}
                                </p>
                            </div>
                        </div>
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
                            disabled={loading || !file}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <motion.div
                                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"
                                />
                            ) : (
                                'Add Resource'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </Modal>
    );
};

export default AddResourceModal; 