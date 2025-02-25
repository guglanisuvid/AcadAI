import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';


const AttemptResult = ({ user }) => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [studentAttempt, setStudentAttempt] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getQuizAttempt = async () => {

            try {
                setLoading(true);
                setError(null);

                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/quizzes/${quizId}/attempt-result`, {
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

                if (data?.studentAnswers?.score === -1) {
                    try {
                        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

                        const response = await fetch(`${API_URL}/api/quizzes/${quizId}/calculate-score`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        const scoreData = await response.json();

                        if (!response.ok) {
                            setError(data.message || 'Failed to create quiz');
                            setLoading(false);
                            return;
                        }

                        data.studentAnswers.score = scoreData.score;

                    } catch (error) {
                        setError(error.message || 'Error calculating score');
                    }
                }

                setQuiz(data?.quizDetails);
                setStudentAttempt(data?.studentAnswers);
                setAnswers(data?.answers);

            } catch (error) {
                setError(error.message || 'Error creating quiz');
            } finally {
                setLoading(false);
            }
        };

        getQuizAttempt();
    }, []);

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
                        {/* Quiz Duration */}
                        <div className="text-gray-600 line-clamp-1 mb-4">
                            Quiz Duration: {quiz?.duration} minutes
                        </div>
                        {/* Quiz Submission Date and Time */}
                        <div className="text-gray-600 line-clamp-1">
                            Submitted on {
                                new Date(studentAttempt?.submittedAt).toLocaleString('en-US', {
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
                        {/* Total number of questions */}
                        <div className="text-red-700 font-medium line-clamp-1">
                            Total number of questions: {answers.length}
                        </div>
                        {/* Correct answers */}
                        <div className=" text-indigo-700 font-medium line-clamp-1">
                            Correct Answers: {studentAttempt?.score}
                        </div>
                        {/* Quiz Submission Date and Time */}
                        <div className="text-green-700 font-medium line-clamp-1">
                            Percentage: {((studentAttempt?.score / answers.length) * 100).toFixed(2)}%
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Questions */}
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className='w-full grid grid-cols-3 gap-6 items-center'
            >
                <div className='h-full col-span-1 bg-white p-2 sm:p-4 lg:p-6 shadow-md rounded-lg'>
                    <div className='w-full grid grid-cols-5 gap-6 items-center'>
                        {answers.map((question, index) => (
                            <motion.button
                                key={question._id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCurrentQuestion(index)}
                                className={`h-10 w-10 flex justify-between items-center text-gray-800 bg-gray-100 hover:bg-indigo-100 shadow-sm rounded-lg ${studentAttempt?.answers.map(answer => answer?.questionIndex).includes(index) ? 'bg-green-100' : 'bg-gray-100'}`}
                            >
                                <div className='w-full text-center'>{index + 1}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>
                <div className='h-full col-span-2 bg-white p-2 sm:p-4 lg:p-6 shadow-md rounded-lg'>
                    <div>
                        <div className='text-xl font-medium text-gray-800'>
                            {currentQuestion + 1}. {answers[currentQuestion]?.question}
                        </div>
                        {answers[currentQuestion]?.options.map((option, index) => (
                            <div key={option._id} className='flex items-center gap-3 mt-3'>
                                <input
                                    type='radio'
                                    id={option._id}
                                    name='quiz'
                                    value={option._id}
                                    readOnly={true}
                                    {...studentAttempt?.answers.map(answer => answer.questionIndex === currentQuestion && answer.selectedOption === index).includes(true) && { checked: true }}
                                />
                                <label htmlFor={option._id} className='text-gray-800'>{option?.text}</label>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col gap-3 mt-6'>
                        <div className={`${answers[currentQuestion]?.options[studentAttempt?.answers[currentQuestion]?.selectedOption] === answers[currentQuestion]?.options[answers[currentQuestion]?.correctOption] ? 'text-green-700' : 'text-red-700'} font-medium line-clamp-2`}>
                            Marked Answer: {answers[currentQuestion]?.options[studentAttempt?.answers[currentQuestion]?.selectedOption]?.text}
                        </div>
                        <div className='text-gray-600 font-medium line-clamp-2'>
                            Correct Answer: {answers[currentQuestion]?.options[answers[currentQuestion]?.correctOption]?.text}
                        </div>
                    </div>
                    <div className='flex gap-3 justify-end mt-6'>
                        {currentQuestion > 0 && <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            className='flex justify-between items-center px-3 py-2 bg-indigo-100 text-gray-700 shadow-sm rounded-lg'
                        >
                            <FiArrowLeft className='mr-1' />
                            Previous Question
                        </motion.button>}
                        {currentQuestion < answers.length - 1 && <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            className='flex justify-between items-center px-3 py-2 bg-indigo-500 text-white shadow-sm rounded-lg'
                        >
                            Next Question
                            <FiArrowRight className='ml-1' />
                        </motion.button>}
                    </div>
                </div>
            </motion.div>
        </motion.div >
    );
};

export default AttemptResult;