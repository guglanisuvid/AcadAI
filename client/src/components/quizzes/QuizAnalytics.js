import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import { FiArrowDown, FiArrowLeft, FiArrowUp, FiBarChart2, FiChevronLeft, FiChevronRight, FiChevronsRight, FiDelete } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import SearchField from '../common/SearchField';

const QuizAnalytics = ({ user }) => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [filteredAttempts, setFilteredAttempts] = useState([]);
    const [filter, setFilter] = useState('');
    const [filterOpened, setFilterOpened] = useState(false);
    const [Sort, setSort] = useState('');
    const [sortOpened, setSortOpened] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizAttempts = async () => {
            try {
                setLoading(true);
                setError(null);

                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/quizzes/${quizId}/analytics`, {
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

                setQuiz(data?.quiz);
                setQuizQuestions(data?.questions);
                setQuizAttempts(data?.attempts);

            } catch (error) {
                setError(error?.message);
            } finally {
                setLoading(false);
            }

            setLoading(false);
        }

        fetchQuizAttempts();
    }, []);

    useEffect(() => {
        setFilteredAttempts(quizAttempts.filter(attempt =>
            attempt?.studentId?.name.toLowerCase().includes(searchQuery?.toLowerCase())
            ||
            attempt?.studentId?.email.toLowerCase().includes(searchQuery?.toLowerCase())
        ));
    }, [searchQuery, quizAttempts]);

    useEffect(() => {
        setFilteredAttempts(quizAttempts.filter(attempt => {
            if (filter === 'Less than 50%') {
                return ((attempt.score) / (quizQuestions.length) * 100).toFixed(2) < 50;
            }

            if (filter === 'More than 50%') {
                return ((attempt.score) / (quizQuestions.length) * 100).toFixed(2) >= 50;
            }

            if (filter === 'Between 50% to 75%') {
                return ((attempt.score) / (quizQuestions.length) * 100).toFixed(2) >= 50
                    &&
                    ((attempt.score) / (quizQuestions.length) * 100).toFixed(2) < 75;
            }

            if (filter === 'More than 75%') {
                return ((attempt.score) / (quizQuestions.length) * 100).toFixed(2) >= 75;
            }

            if (filter === '') {
                return quizAttempts;
            }

            setFilterOpened(false);

            return true;

        }));

        setFilterOpened(false);
    }, [filter, quizAttempts]);

    useEffect(() => {
        if (Sort === 'A to Z') {
            setFilteredAttempts([...filteredAttempts].sort((a, b) => a?.studentId?.name.localeCompare(b?.studentId?.name)));
        }

        if (Sort === 'Z to A') {
            setFilteredAttempts([...filteredAttempts].sort((a, b) => b?.studentId?.name.localeCompare(a?.studentId?.name)));
        }

        if (Sort === 'Highest Marks') {
            setFilteredAttempts([...filteredAttempts].sort((a, b) => b.score - a.score));
        }

        if (Sort === 'Lowest Marks') {
            setFilteredAttempts([...filteredAttempts].sort((a, b) => a.score - b.score));
        }

        setSortOpened(false);
    }, [Sort, quizAttempts]);

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
                    onClick={() => navigate(`/classes/${quiz?.classId}`)}
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
                    <div className='col-span-2 bg-white rounded-lg shadow-md p-6'>
                        {/* Quiz Name */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 line-clamp-1">
                            {quiz?.title}
                        </h1>
                        {/* Quiz Submission Date and Time */}
                        <div className="text-gray-600 mb-4 line-clamp-1">
                            Number of Questions: {quizQuestions.length}
                        </div>
                        {/* Quiz Duration */}
                        <div className="text-gray-600 line-clamp-1">
                            Quiz Duration: {quiz?.duration} minutes
                        </div>
                    </div>
                    <div className='col-span-1 h-full flex flex-col gap-3 justify-between bg-white rounded-lg shadow-md p-6'>
                        {/* Number of studentes who attempted the quiz */}
                        <div className="text-indigo-700 font-medium line-clamp-1">
                            Number of students Attempted: {quizAttempts?.length}
                        </div>
                        {/* Correct answers */}
                        <div className=" text-green-700 font-medium line-clamp-1">
                            Highest Score Acheived: {Math.max(...quizAttempts?.map(attempt => attempt.score))}
                        </div>
                        {/* Quiz Submission Date and Time */}
                        <div className="text-red-700 font-medium line-clamp-1">
                            Lowest Score Acheived: {Math.min(...quizAttempts?.map(attempt => attempt.score))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex gap-6 items-center ${error ? 'justify-between' : 'justify-end'}`}
            >
                {/* Error Message */}
                {error && (
                    <div className="text-red-700 bg-red-100 px-3 py-1.5 rounded-md text-sm line-clamp-1">
                        Error: {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex justify-between items-center gap-6">
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setFilterOpened(false);
                                setSortOpened(!sortOpened);
                            }}
                            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                                ${sortOpened
                                    ? 'bg-green-100 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Sort
                        </motion.button>

                        <AnimatePresence>
                            {sortOpened && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                >
                                    <button
                                        onClick={() => setSort('A to Z')}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiBarChart2 className="mr-2" />
                                        A to Z
                                    </button>
                                    <button
                                        onClick={() => setSort('Z to A')}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiBarChart2 className="mr-2" />
                                        Z to A
                                    </button>
                                    <button
                                        onClick={() => setSort('Highest Marks')}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiArrowUp className="mr-2" />
                                        Highest Marks
                                    </button>
                                    <button
                                        onClick={() => setSort('Lowest Marks')}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiArrowDown className="mr-2" />
                                        Lowest Marks
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setSortOpened(false);
                                setFilterOpened(!filterOpened);
                            }}
                            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 
                            ${filterOpened
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Filter
                        </motion.button>

                        <AnimatePresence>
                            {filterOpened && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                >
                                    <button
                                        onClick={() => setFilter('Less than 50%')}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiChevronLeft className="mr-2" />
                                        Less than 50%
                                    </button>
                                    <button
                                        onClick={() => setFilter('More than 50%')}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiChevronRight className="mr-2" />
                                        More than 50%
                                    </button>
                                    <button
                                        onClick={() => setFilter('Between 50% to 75%')}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiChevronsRight className="mr-2" />
                                        Between 50% to 75%
                                    </button>
                                    <button
                                        onClick={() => setFilter('More than 75%')}
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiChevronsRight className="mr-2" />
                                        More than 75%
                                    </button>
                                    <button
                                        onClick={() => setFilter('')}
                                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <FiDelete className="mr-2" />
                                        Clear Filter
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <SearchField
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder={`Search Attempts...`}
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className='w-full h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide bg-white rounded-lg shadow-md p-6 mb-6'>
                    <table className="w-full text-center">
                        <thead>
                            <tr className="text-gray-600">
                                <th className="py-2">Avatar</th>
                                <th className="py-2">Student Name</th>
                                <th className="py-2">Student Email</th>
                                <th className="py-2">Submission Time</th>
                                <th className="py-2">Correct Answers</th>
                                <th className="py-2">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttempts.map((attempt) => (
                                <tr key={attempt._id} className="border-t border-gray-300">
                                    <td className="py-2">
                                        <img
                                            className="h-6 w-6 rounded-full mx-auto object-cover"
                                            src={attempt?.studentId?.avatar || '/default-avatar.png'}
                                            alt={attempt.studentId.name}
                                            onError={(e) => {
                                                e.target.src = '/default-avatar.png';
                                            }}
                                        />
                                    </td>
                                    <td className="text-sm py-2">{attempt?.studentId?.name}</td>
                                    <td className="text-sm py-2">{attempt?.studentId?.email}</td>
                                    <td className="text-sm py-2">
                                        {
                                            new Date(attempt?.submittedAt).toLocaleString('en-US', {
                                                timeZone: 'Asia/Kolkata',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })
                                        }
                                    </td>
                                    <td className="text-sm py-2">{attempt.score}</td>
                                    <td className={`text-sm font-medium py-2
                                         ${((attempt.score) / (quizQuestions.length) * 100).toFixed(2) < 50
                                        &&
                                        'text-red-700'
                                        }
                                          ${(((attempt.score) / (quizQuestions.length) * 100).toFixed(2) >= 50)
                                        &&
                                        (((attempt.score) / (quizQuestions.length) * 100).toFixed(2) < 75)
                                        &&
                                        'text-indigo-700'
                                        }
                                          ${(((attempt.score) / (quizQuestions.length) * 100).toFixed(2) >= 75)
                                        &&
                                        'text-green-700'
                                        }
                                            `}>
                                        {
                                            ((attempt.score) / (quizQuestions.length) * 100).toFixed(2)
                                        }%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default QuizAnalytics;