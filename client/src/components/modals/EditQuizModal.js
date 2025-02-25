import { useState } from 'react';
import { FiEdit, FiX, FiType, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import { useParams } from 'react-router-dom';

const EditQuizModal = ({ quiz, isOpen, onClose, onQuizUpdate }) => {
    const { id: classId } = useParams();
    const [formData, setFormData] = useState({
        classId,
        title: quiz?.title,
        duration: quiz?.duration,
        validTill: new Date(new Date(quiz?.validTill).getTime() - (new Date(quiz?.validTill).getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 16)
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEditQuiz = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const validTill = new Date(`${formData.validTill}`);

            if (new Date(`${formData?.validTill}`) <= new Date()) {
                setError('Please select a future date and time');
                setLoading(false);
                return;
            }

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/quizzes/${quiz._id}/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.title,
                    duration: parseInt(formData.duration),
                    validTill: validTill.toISOString(),
                    classId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to create quiz');
                setLoading(false);
                return;
            }

            onQuizUpdate(data?.quiz);

            onClose();

        } catch (error) {
            setError(error.message || 'Error creating quiz');
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
                        <FiEdit className="mr-2" />
                        Edit Quiz
                    </h2>
                    <button
                        onClick={() => {
                            setFormData({
                                title: '',
                                duration: 30,
                                validTill: ''

                            });
                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleEditQuiz} className="p-6 space-y-6">
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
                            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                            required
                            placeholder="Enter quiz title"

                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FiClock className="mr-2" />
                            Duration (in minutes)
                        </label>
                        <input
                            type="number"
                            min="5"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FiClock className="mr-2" />
                            Valid Till
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.validTill}
                            onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                            className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                            required

                        />
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
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <motion.div
                                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"
                                />
                            ) : (
                                'Edit Quiz'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </Modal>
    );
};

export default EditQuizModal;