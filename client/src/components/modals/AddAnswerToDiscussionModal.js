import React, { useState } from 'react';
import Modal from '../common/Modal';
import { motion } from 'framer-motion';
import { FiPenTool, FiX, FiType } from 'react-icons/fi';

const AddAnswerToDiscussionModal = ({ onClose, isOpen, userId, discussionId, question, onSuccess }) => {
    const [formData, setFormData] = useState({
        answer: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnswerDiscussion = async () => {
        // Validation
        if (!formData.answer.trim()) {
            setError("Answer is required");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log(formData);

            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

            const response = await fetch(`${API_URL}/api/discussions/${discussionId}/answer`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    answers: [{
                        answer: formData.answer,
                        answeredBy: userId
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                setError(data.message || "Failed to create note");
                return;
            }

            setFormData({
                answer: ''
            });

            onClose();
            onSuccess(data?.discussion?.answers.find(answer => answer?.answeredBy?._id === userId));

        } catch (error) {
            setError("Failed to answer discussion: " + error.message);
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
                        Add Answer To Discussion
                    </h2>
                    <button
                        onClick={() => {
                            setFormData({
                                question: '',
                            });

                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <div className="text-blue-500 text-sm px-6 py-2">
                    Note: You can only answer a discussion once.
                </div>

                {/* Form */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAnswerDiscussion();
                }} className="p-6 space-y-6">
                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FiType className="w-5 h-5 mr-2" />
                            {question}
                        </label>
                    </div>

                    <div>
                        <textarea
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            rows={8}
                            className="w-full mt-1 block border border-gray-300 rounded-md p-2 shadow-sm resize-none outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Add your answer here..."
                        />
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <motion.div
                                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"
                                />
                            ) : (
                                'Add Answer'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </Modal>
    );

};

export default AddAnswerToDiscussionModal;