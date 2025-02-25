import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiBookmark } from 'react-icons/fi';

const QuizAttempt = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getQuiz = async () => {

            try {
                setLoading(true);
                setError(null);

                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

                const response = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
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
                setTimeLeft(data?.quiz?.duration * 60);
                setCurrentQuestion(0);

            } catch (error) {
                setError(error.message || 'Error creating quiz');
            } finally {
                setLoading(false);
            }
        };

        getQuiz();
    }, []);

    useEffect(() => {
        if (timeLeft !== null) {
            const handleTimeEndSubmission = async () => {
                await handleSubmission();
                navigate(`/quizzes/${quizId}/attempt-result`);
            };

            if (timeLeft <= 0) {
                handleTimeEndSubmission();
            }

            const intervalId = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [timeLeft]);

    const handleSubmission = async () => {

        if (selectedOption === null) return;

        try {
            setLoading(true);
            setError(null);

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/quizzes/${quizId}/attempt`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    answers: [{
                        questionIndex: currentQuestion,
                        question: quiz?.questions[currentQuestion]?.question,
                        selectedOption
                    }], submittedAt: new Date()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to submit quiz');
                setTimeout(() => setError(null), 5000);
                setLoading(false);
                return;
            }

            setAnswers(data?.quiz?.answers);
            setAnsweredQuestions(data?.quiz?.answers.map(answer => answer.questionIndex));
            setSelectedOption(null);

        } catch (error) {
            setError(error.message || 'Error creating quiz');
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = (questionIndex) => {
        try {
            setLoading(true);
            bookmarkedQuestions.includes(questionIndex)
                ?
                setBookmarkedQuestions(bookmarkedQuestions.filter(index => index !== questionIndex))
                :
                setBookmarkedQuestions([...bookmarkedQuestions, questionIndex]);
        } catch (error) {
            setError(error.message || 'Error creating quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-screen-xl w-full min-h-screen flex flex-col gap-6 mx-auto'>
            <div className="w-full bg-white px-4 sm:px-6 lg:px-8 shadow-md rounded-b-lg">
                <div className="flex justify-between items-center gap-6 h-16">
                    {/* Left side - Quiz Name */}
                    <div className="text-2xl font-bold text-indigo-600 line-clamp-1">
                        {quiz?.title}
                    </div>

                    {/* Right side - Timer */}
                    <div className="text-2xl font-bold text-indigo-600">
                        {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>}

            {/* Error Message */}
            {error && (
                <div className="text-red-700 bg-red-100 px-3 py-1.5 rounded-md text-sm line-clamp-1">
                    Error: {error}
                </div>
            )}

            <div className="w-full grid grid-cols-3 gap-6 items-center">
                <div className='h-full col-span-1 bg-white p-2 sm:p-4 lg:p-6 shadow-md rounded-lg'>
                    <div className='w-full grid grid-cols-5 gap-6 items-center'>
                        {quiz?.questions.map((question, index) => (
                            <motion.button
                                key={question._id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCurrentQuestion(index)}
                                className={`h-10 w-10 flex justify-between items-center ${bookmarkedQuestions.includes(index) ? 'bg-red-100' : 'bg-gray-100'} ${answeredQuestions.includes(index) && !bookmarkedQuestions.includes(index) ? 'bg-green-100' : 'bg-gray-100'} text-gray-800 hover:bg-indigo-100 shadow-sm rounded-lg`}
                            >
                                <div className='w-full text-center'>{index + 1}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>
                <div className='h-full col-span-2 bg-white p-2 sm:p-4 lg:p-6 shadow-md rounded-lg'>
                    <div>
                        <div className='text-xl font-medium text-gray-800'>
                            {currentQuestion + 1}. {quiz?.questions[currentQuestion]?.question}
                        </div>
                        {quiz?.questions[currentQuestion]?.options.map((option, index) => (
                            <div key={option._id} className='flex items-center gap-3 mt-3'>
                                <input
                                    type='radio'
                                    id={option._id}
                                    name='quiz'
                                    value={option._id}
                                    {...answers.map(answer => answer.questionIndex === currentQuestion && answer.selectedOption === index).includes(true) && { defaultChecked: true }}
                                    onChange={() => setSelectedOption(index)}
                                />
                                <label htmlFor={option._id} className='text-gray-800'>{option?.text}</label>
                            </div>
                        ))}
                    </div>
                    <div className='flex gap-3 justify-between mt-6'>
                        {/* Bookmark Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBookmark(currentQuestion)}
                            className={`flex justify-between items-center px-3 py-2 ${bookmarkedQuestions.includes(currentQuestion) ? 'bg-red-100' : 'bg-gray-100'} text-gray-800 hover:bg-red-100 shadow-sm rounded-lg`}
                        >
                            <FiBookmark />
                        </motion.button>

                        {/* Previous and Next Question Button */}
                        <div className='flex gap-3'>
                            {currentQuestion > 0 && <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    await handleSubmission();
                                    setCurrentQuestion(currentQuestion - 1);
                                }}
                                className='flex justify-between items-center px-3 py-2 bg-indigo-100 text-gray-700 shadow-sm rounded-lg'
                            >
                                <FiArrowLeft className='mr-1' />
                                Previous Question
                            </motion.button>}
                            {currentQuestion < quiz?.questions.length - 1 && <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    await handleSubmission();
                                    setCurrentQuestion(currentQuestion + 1);
                                }}
                                className='flex justify-between items-center px-3 py-2 bg-indigo-500 text-white shadow-sm rounded-lg'
                            >
                                Next Question
                                <FiArrowRight className='ml-1' />
                            </motion.button>}
                            {currentQuestion === quiz?.questions.length - 1 && <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    await handleSubmission();
                                    navigate(`/quizzes/${quizId}/attempt-result`);
                                }}
                                className='flex justify-between items-center px-3 py-2 bg-green-700 text-white shadow-sm rounded-lg'
                            >
                                Submit Quiz
                            </motion.button>}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default QuizAttempt;