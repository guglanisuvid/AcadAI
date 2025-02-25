import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiEdit, FiTrash2, FiBook, FiCalendar, FiBookOpen, FiPlus, FiCheck, FiBarChart } from 'react-icons/fi';
import AddQuestionsModal from '../../modals/AddQuestionsModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import DeleteConfirmationModal from '../../modals/DeleteConfirmationModal';
import EditQuizModal from '../../modals/EditQuizModal';
import AttemptQuizModal from '../../modals/AttemptQuizModal';

const QuizCard = ({ userId, quiz, isInstructor, onDelete, setError, onQuizUpdate }) => {
    const [showEditQuizModal, setshowEditQuizModal] = useState(false);
    const [showAddQuestionsModal, setShowAddQuestionsModal] = useState(false);
    const [showPublishConfirm, setShowPublishConfirm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAttemptQuizModal, setShowAttemptQuizModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handlePublishQuiz = async () => {
        try {
            setLoading(true);

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/quizzes/${quiz._id}/publish`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to publish quiz');
                setLoading(false);
                return;
            }

            onQuizUpdate({ ...quiz, isPublished: true });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePublishQuizModal = async () => {
        try {
            setLoading(true);
            if (quiz.validTill <= new Date().toISOString()) {
                setError('Change the due date to a future date before publishing');
                setTimeout(() => setError(null), 5000);
                setLoading(false);
                return;
            }

            if (quiz.questions.length === 0) {
                setError('Add questions to the quiz before publishing');
                setTimeout(() => setError(null), 5000);
                setLoading(false);
                return;
            }

            if (quiz.duration < 5 || quiz.duration > 180) {
                setError('Duration must be between 5 and 180 minutes');
                setTimeout(() => setError(null), 5000);
                setLoading(false);
                return;
            }

            setShowPublishConfirm(true);
        } catch (error) {
            setError('Error validating due date');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(
                `${API_URL}/api/quizzes/${quiz._id}/delete`,
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

            onDelete(quiz._id);
            setShowDeleteModal(false);
        } catch (error) {
            setError('Error deleting resource');
        } finally {
            setLoading(false);
        }
    };

    const handleAttemptQuizModal = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!quiz?.isPublished || quiz?.validTill < new Date().toISOString()) {
                setError('You are not authorized to attempt the quiz');
                setTimeout(() => setError(null), 5000);
                setLoading(false);
                return;
            }

            setShowAttemptQuizModal(true);
        } catch (error) {
            setError(error.message || 'Error creating quiz');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={quiz?.validTill < new Date().toISOString() ? { scale: 1 } : { scale: 1.01 }}
                className={`h-full flex flex-col justify-between gap-2 border border-gray-200 rounded-lg p-4 shadow-sm ${quiz?.validTill < new Date().toISOString() && quiz?.isPublished ? 'bg-gray-100' : 'bg-white hover:shadow-md transition-all duration-200'}`}
            >
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <FiBook className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {quiz?.title}
                        </h3>
                    </div>

                    {isInstructor && !quiz.isPublished && <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setshowEditQuizModal(true)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-100"
                    >
                        <FiEdit className="w-4 h-4" />
                    </motion.button>
                    }
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                        <span>{quiz.questions?.length || 0} {quiz.questions?.length === 1 ? 'Question' : 'Questions'}</span>
                    </div>
                    {isInstructor && !quiz.isPublished && <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAddQuestionsModal(true)}
                        className="inline-flex items-center text-sm text-blue-600"
                    >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add Questions
                    </motion.button>
                    }
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1" />
                    <span>Duration: {quiz?.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-1" />
                    <span>Due Date: {
                        new Date(quiz?.validTill).toLocaleString('en-US', {
                            timeZone: 'Asia/Kolkata',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })
                    }</span>
                </div>

                <div className="flex items-center gap-3">
                    {isInstructor ? (
                        <>
                            {
                                !quiz.isPublished
                                &&
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handlePublishQuizModal}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                                >
                                    <FiCheck className="w-4 h-4 mr-1.5" />
                                    Publish
                                </motion.button>
                            }
                            {
                                quiz?.isPublished
                                &&
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => navigate(`/quizzes/${quiz._id}/analytics`)}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                                >
                                    <FiBarChart className="w-4 h-4 mr-1.5" />
                                    Get Quiz Analytics
                                </motion.button>
                            }

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowDeleteModal(true)}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                            >
                                <FiTrash2 className="w-4 h-4 mr-1.5" />
                                Delete
                            </motion.button>
                        </>
                    ) : (
                        <>
                            {
                                quiz?.validTill > new Date().toISOString()
                                    &&
                                    (
                                        !quiz?.attempts.find(attempt => attempt.studentId === userId)?.submittedAt
                                        ||
                                        (new Date() - new Date(quiz?.attempts.find(attempt => attempt.studentId === userId)?.submittedAt) < 5 * 60 * 1000)
                                    )
                                    ?
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleAttemptQuizModal}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                    >
                                        <FiBookOpen className="w-4 h-4 mr-1.5" />
                                        Attempt Quiz
                                    </motion.button>
                                    :
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => navigate(`/quizzes/${quiz._id}/attempt-result`)}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                    >
                                        <FiBarChart className="w-4 h-4 mr-1.5" />
                                        Get Result
                                    </motion.button>
                            }
                        </>
                    )}
                </div>
            </motion.div >

            <AddQuestionsModal
                isOpen={showAddQuestionsModal}
                onClose={() => setShowAddQuestionsModal(false)}
                quiz={quiz}
                onQuizUpdate={onQuizUpdate}
            />

            <EditQuizModal
                isOpen={showEditQuizModal}
                onClose={() => setshowEditQuizModal(false)}
                quiz={quiz}
                onQuizUpdate={onQuizUpdate}
            />

            <ConfirmationModal
                isOpen={showPublishConfirm}
                title="Publish Quiz"
                message={
                    "You will not be able to edit the quiz after publishing. Are you sure you want to publish this quiz?"
                }
                confirmText="Publish"

                onConfirm={() => {
                    setShowPublishConfirm(false);
                    handlePublishQuiz();
                }}
                onCancel={() => setShowPublishConfirm(false)}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title={`Delete "${quiz?.title}"`}
                message={
                    "Are you sure you want to delete this quiz?"
                }
            />

            <AttemptQuizModal
                isOpen={showAttemptQuizModal}
                onClose={() => setShowAttemptQuizModal(false)}
                quiz={quiz}
            />
        </>
    );
};

export default QuizCard; 