import { useState } from 'react';
import { FiX, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import { useNavigate, useParams } from 'react-router-dom';

const AttemptQuizModal = ({ quiz, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center line-clamp-1">
                        <FiBookOpen className="mr-2" />
                        {quiz?.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={() => navigate(`/quizzes/${quiz._id}/attempt`)} className="p-6 flex flex-col gap-6">

                    {/* Number of Questions */}
                    <div className='line-clamp-1'>
                        <span className='font-medium'>Number of questions: </span> {quiz?.questions.length}
                    </div>

                    {/* Duration */}
                    <div className='line-clamp-1'>
                        <span className='font-medium'>Duration: </span> {quiz?.duration} minutes
                    </div>

                    {/* Due Date */}
                    <div className='line-clamp-1'>
                        <span className='font-medium'>Due Date: </span> {
                            new Date(quiz?.validTill).toLocaleString('en-US', {
                                timeZone: 'Asia/Kolkata',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })
                        }
                    </div>

                    {/* Instructions */}
                    <div className='line-clamp-10'>
                        <span className='font-medium'>Instructions: </span> {quiz?.instructions}
                        <ul className='list-disc list-inside'>
                            <li>Make sure to have a stable internet connection.</li>
                            <li>Don't close or change tabs after starting the quiz.</li>
                            <li>All the questions will be in MCQs form.</li>
                            <li>You can only select one option per question.</li>
                            <li>The quiz will get submitted, once the timer runs out.</li>
                        </ul>
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
                                'Attempt Quiz'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </Modal >
    );
};

export default AttemptQuizModal;