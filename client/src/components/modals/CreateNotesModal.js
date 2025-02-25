import React, { useState } from "react";
import { motion } from 'framer-motion';
import Modal from "../common/Modal";
import { FiPenTool, FiType, FiX } from "react-icons/fi";

const CreateNotesModal = ({ isOpen, onClose, classId, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: "",
        classId
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateNotes = async () => {
        // Validation
        if (!formData.title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

            const response = await fetch(`${API_URL}/api/notes/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    classId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                setError(data.message || "Failed to create note");
                return;
            }

            setFormData({
                title: ''
            });

            onClose();
            onSuccess(data?.note);

        } catch (error) {
            setError("Failed to create note: " + error.message);
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
                        <FiPenTool className="mr-2" />
                        Create Notes
                    </h2>
                    <button
                        onClick={() => {
                            setFormData({
                                title: '',
                            });

                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateNotes();
                }} className="p-6 space-y-6">
                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
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
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                            required
                            placeholder="Enter Notes Title"

                        />
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-fuchsia-600 rounded-md hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <motion.div
                                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"
                                />
                            ) : (
                                'Create Notes'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </Modal>
    );
};

export default CreateNotesModal;