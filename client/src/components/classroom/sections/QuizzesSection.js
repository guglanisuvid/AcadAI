import React, { useState, useEffect } from 'react';
import QuizCard from '../cards/QuizCard';

const QuizzesSection = ({ userId, classId, isInstructor, setError, quiz, onQuizUpdate, searchQuery }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [filterQuizzes, setFilterQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

                const response = await fetch(
                    `${API_URL}/api/quizzes/class/${classId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setLoading(false);
                    setError(data.message || 'Failed to fetch quizzes');
                    return;
                }

                setQuizzes(data?.quizzes);

            } catch (error) {
                setError(error.message || 'Failed to fetch quizzes');
            } finally {
                setLoading(false);
            }
        }
        fetchQuizzes();

    }, []);

    useEffect(() => {
        if (quiz) {
            setQuizzes(prev => [quiz, ...prev]);
        }
    }, [quiz]);

    useEffect(() => {
        setFilterQuizzes(quizzes.filter(quiz =>
            quiz?.title.toLowerCase().includes(searchQuery?.toLowerCase())
        ));
    }, [searchQuery, quizzes]);

    const handleQuizUpdate = (updatedQuiz) => {
        try {
            setQuizzes(prev => prev.map(quiz => quiz._id === updatedQuiz._id ? updatedQuiz : quiz));
        } catch (error) {
            setError(error.message || 'Failed to update quiz');
        }
    };

    const handleDeleteQuiz = (quizId) => {
        try {
            setQuizzes(prev => prev.filter(quiz => quiz._id !== quizId));
        } catch (error) {
            setError(error.message || 'Failed to delete quiz');
        }
    };

    return (
        <div className='w-full h-full flex flex-col p-6 overflow-y-auto scrollbar-hide'>

            {/* Loading */}
            {loading && <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>}

            {/* Quizzes */}
            <div className={`${filterQuizzes.length ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'h-full'}`}>
                {searchQuery === '' && filterQuizzes.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No quizzes uploaded yet</p>
                    </div>
                )}

                {searchQuery !== '' && filterQuizzes.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No resources found related to search query</p>
                    </div>
                )}

                {filterQuizzes.map(quiz => (
                    <QuizCard
                        key={quiz._id}
                        userId={userId}
                        quiz={quiz}
                        isInstructor={isInstructor}
                        setError={setError}
                        onDelete={handleDeleteQuiz}
                        onQuizUpdate={(updatedQuiz) => {
                            handleQuizUpdate(updatedQuiz);
                            onQuizUpdate(updatedQuiz);
                        }}
                    />
                ))}
            </div>
        </div>

    );
};

export default QuizzesSection; 