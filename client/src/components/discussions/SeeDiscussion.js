import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import Navbar from '../layout/Navbar';
import AddAnswerToDiscussionModal from '../modals/AddAnswerToDiscussionModal';


const SeeDiscussion = ({ user }) => {
    const { discussionId } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [showAddAnswerModal, setShowAddAnswerModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                setLoading(true);
                setError(null);

                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/discussions/${discussionId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || 'Failed to create quiz');
                    setLoading(false);
                    return;
                }

                setDiscussion(data?.discussion);

            } catch (error) {
                setError(error?.message);
            } finally {
                setLoading(false);
            }

            setLoading(false);
        }

        fetchDiscussion();
    }, []);

    const handleAddAnswer = (answer) => {
        setDiscussion(prev => ({
            ...prev,
            answers: [answer, ...prev.answers]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-screen-xl flex flex-col min-h-screen gap-6 mx-auto"
        >
            <Navbar user={user} />
            {/* Back Button */}
            <div>
                <button
                    onClick={() => navigate(`/classes/${discussion?.classId}`)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Class
                </button>
            </div>

            {/* Loading */}
            {
                loading && <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            }

            {/* Error Message */}
            {
                error && (
                    <div className="text-red-700 bg-red-100 px-3 py-1.5 rounded-md text-sm line-clamp-1">
                        Error: {error}
                    </div>
                )
            }

            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="grid grid-cols-3 justify-between items-center gap-6">
                    <div className='h-full col-span-2 flex flex-col justify-evenly bg-white rounded-lg shadow-md p-6'>

                        {/* Discussion creator name, email and avatar */}
                        <div className="text-gray-600 mb-4 line-clamp-1 flex gap-2 items-center">
                            <img
                                className="h-6 w-6 rounded-full object-cover"
                                src={discussion?.askedBy?.avatar || '/default-avatar.png'}
                                alt={discussion?.askedBy?.name}
                                onError={(e) => {
                                    e.target.src = '/default-avatar.png';
                                }}
                            />
                            <span>{discussion?.askedBy?.name}</span>{' '}<span>({discussion?.askedBy?.email})</span>
                        </div>
                        {/* Discussion creation date and time */}
                        <div className="text-gray-600 line-clamp-1 flex gap-2 items-center">
                            <FiCalendar className="w-5 h-5" />
                            Created on {' '}
                            {
                                new Date(discussion?.createdAt).toLocaleString('en-US', {
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
                    </div>
                    <div className='col-span-1 h-full flex flex-col gap-3 justify-between bg-white rounded-lg shadow-md p-6'>
                        {/* Number of studentes who attempted the quiz */}
                        <div className="text-indigo-700 font-medium line-clamp-2">
                            {discussion?.answers?.length === 0 && 'No one has joined the discussion yet.'}
                            {discussion?.answers?.length > 0 && (
                                <>
                                    {discussion?.answers?.length} {discussion?.answers?.length > 1 ? 'people' : 'person'} joined the discussion.
                                </>
                            )}
                        </div>
                        {/* Last answered on */}
                        <div className=" text-green-700 font-medium line-clamp-2">
                            Last answered on {' '}
                            {
                                new Date(discussion?.updatedAt).toLocaleString('en-US', {
                                    timeZone: 'Asia/Kolkata',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })
                            }
                        </div>
                        {/* Answer Discussion Button */}
                        <div>
                            {
                                discussion?.answers?.some(answer => answer.answeredBy._id === user._id) ? (
                                    <div className="text-indigo-700 font-medium">
                                        You have already answered this discussion.
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowAddAnswerModal(true)}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Add Your Answer to the Discussion
                                    </motion.button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Discussion Question */}
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className='col-span-2 bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-300px)] overflow-y-auto'>
                    <h1 className="text-2xl font-medium text-gray-700">
                        {discussion?.question}
                    </h1>
                </div>
            </motion.div>

            {/* Discussion Answers */}
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className='mb-6'
            >
                <div className='bg-white rounded-lg shadow-md flex flex-col max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide gap-6 p-6'>
                    {
                        discussion?.answers?.length > 0 && (
                            discussion?.answers.map((answer, index) => (
                                <div key={index} className="flex flex-col gap-6">
                                    <div className='flex justify-between items-center gap-3'>
                                        <div className="text-gray-600 line-clamp-1 flex gap-2 items-center">
                                            <img
                                                className="h-6 w-6 rounded-full object-cover"
                                                src={answer?.answeredBy?.avatar || '/default-avatar.png'}
                                                alt={discussion?.answer?.name}
                                                onError={(e) => {
                                                    e.target.src = '/default-avatar.png';
                                                }}
                                            />
                                            <span>{answer?.answeredBy?.name}</span>{' '}
                                        </div>
                                        <div className=" text-green-700 font-medium line-clamp-1">
                                            {
                                                new Date(answer?.answeredOn).toLocaleString('en-US', {
                                                    timeZone: 'Asia/Kolkata',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-700">{answer?.answer}</p>
                                    </div>
                                    <hr />
                                </div>
                            ))
                        )
                    }
                </div>
            </motion.div>

            <AddAnswerToDiscussionModal
                isOpen={showAddAnswerModal}
                onClose={() => setShowAddAnswerModal(false)}
                question={discussion?.question}
                discussionId={discussion?._id}
                userId={user?._id}
                onSuccess={handleAddAnswer}
            />
        </motion.div>
    );
};

export default SeeDiscussion;