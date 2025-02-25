import { motion } from 'framer-motion';
import { FiEdit, FiX, FiType, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import Modal from '../common/Modal';
import { useParams } from 'react-router-dom';

const AddQuestionsModal = ({ isOpen, onClose, quiz, onQuizUpdate }) => {
    const { id: classId } = useParams();
    const [formData, setFormData] = useState({
        classId,
        question: '',
        options: ['', ''],
        correctOption: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddQuestion = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.question.trim()) {
            setError('Question is required');
            return;
        }

        if (formData.options.filter(opt => opt.trim()).length < 2) {
            setError('Minimum two options are required');
            return;
        }

        if (formData.correctOption === null) {
            setError('Please select the correct option');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/quizzes/${quiz._id}/add-questions`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    questions: [{
                        question: formData.question.trim(),
                        options: formData.options.map(opt => ({
                            text: opt.trim()
                        })),
                        correctOption: parseInt(formData.correctOption)
                    }], classId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to add question');
                return;
            }

            // Reset form
            setFormData({
                question: '',
                options: ['', ''],
                correctOption: null
            });

            onQuizUpdate(data?.quiz);

            onClose();

        } catch (error) {
            setError(error.message || 'Error adding question');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOption = () => {
        if (formData.options.length >= 5) {
            setError('Maximum 5 options allowed per question');
            return;
        }
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleDeleteOption = (indexToDelete) => {
        if (formData.options.length <= 2) {
            setError('Minimum two options are required');
            return;
        }

        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, index) => index !== indexToDelete),
            // Reset correctOption if deleted option was the correct one
            correctOption: prev.correctOption === indexToDelete ? null :
                prev.correctOption > indexToDelete ? prev.correctOption - 1 : prev.correctOption
        }));
    };

    return (
        <>
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
                            Add Questions to Quiz
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAddQuestion} className="p-6 space-y-6">
                        <div className="text-gray-500 text-sm">
                            Number of questions till now: {quiz?.questions?.length}
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <FiType className="mr-2" />
                                Question
                            </label>
                            <textarea
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                className="mt-1 block w-full rounded-md resize-none border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                                rows={3}
                                required
                                placeholder="Enter your question here"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700">Options</label>
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span className="mt-2 text-sm font-medium text-gray-500 w-6">
                                        {index + 1}.
                                    </span>
                                    <textarea
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="flex-1 rounded-md resize-none border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-0 sm:text-sm transition-colors duration-200 px-2 py-2 outline-none"
                                        rows={2}
                                        required
                                        placeholder={`Enter option ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteOption(index)}
                                        className="mt-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        title="Delete option"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {formData.options.length < 5 && (
                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                + Add More Options
                            </button>
                        )}

                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Select Correct Option
                            </label>
                            <div className="flex flex-wrap gap-y-2 gap-x-6">
                                {formData.options.map((_, index) => (
                                    <label key={index} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="correctOption"
                                            value={index}
                                            checked={formData.correctOption === index}
                                            onChange={() => setFormData(prev => ({ ...prev, correctOption: index }))}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Option {index + 1}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end gap-3 items-center">
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
                                    'Add Question'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </Modal>
        </>
    );
};

export default AddQuestionsModal;
