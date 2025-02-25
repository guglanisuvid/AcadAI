import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiArrowLeft, FiMoreVertical, FiEdit, FiTrash2, FiLogOut, FiPlus, FiCopy } from 'react-icons/fi';
import Navbar from '../layout/Navbar';
import ConfirmationModal from '../modals/ConfirmationModal';
import EditClassModal from '../modals/EditClassModal';
import StudyResources from './sections/StudyResources';
import QuizzesSection from './sections/QuizzesSection';
import NotesSection from './sections/NotesSection';
import DiscussionSection from './sections/DiscussionSection';
import AddResourceModal from '../modals/AddResourceModal';
import CreateQuizModal from '../modals/CreateQuizModal';
import SearchField from '../common/SearchField';
import CreateNotesModal from '../modals/CreateNotesModal';
import CreateDiscussionModal from '../modals/CreateDiscussionModal';

const Class = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isInstructor = user?.role === 'instructor';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [classData, setClassData] = useState(null);
    const [editingClass, setEditingClass] = useState(null);
    const [active, setActive] = useState('Study Resources');
    const [showAddResourceModal, setShowAddResourceModal] = useState(false);
    const [resource, setresource] = useState(null);
    const [showCreateNotesModal, setShowCreateNotesModal] = useState(false);
    const [note, setnote] = useState(null);
    const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
    const [quiz, setquiz] = useState(null);
    const [showCreateDiscussionModal, setShowCreateDiscussionModal] = useState(false);
    const [discussion, setdiscussion] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchClass = async () => {
            try {
                setLoading(true);
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/classes/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message);
                    setLoading(false);
                    return;
                }

                setClassData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClass();
    }, [id]);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null);
            }, 5000);
        }
    }, [error]);

    const handleAction = (action) => {
        setConfirmAction(action);
        setShowConfirmDialog(true);
        setShowMenu(false);
    };

    const handleConfirm = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const endpoint = confirmAction === 'Delete Class' ? 'delete' : 'leave';

            const response = await fetch(`${API_URL}/api/classes/${id}/${endpoint}`, {
                method: confirmAction === 'Delete Class' ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }

            setShowConfirmDialog(false);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            setError(error.message);
            setShowConfirmDialog(false);
        }
    };

    const handleEditClass = (updatedClass) => {
        setClassData(updatedClass);
        setEditingClass(null);
    };

    const handleAddResource = resourceData => {
        try {
            setShowAddResourceModal(false);
            setSuccess('Resource added successfully!');
            setClassData(prev => ({
                ...prev,
                resources: [...prev?.resources, resourceData?._id]
            }));
            setresource(resourceData);
            setTimeout(() => {
                setSuccess(null);
                setresource(null);
            }, 5000);
        } catch (error) {
            setError('Error adding resource');
        }
    };

    const handleCreateNotes = notesData => {
        try {
            setShowCreateNotesModal(false);
            setSuccess('Notes created successfully!');
            setClassData(prev => ({
                ...prev,
                notes: [...prev?.notes, notesData?._id]
            }));
            setnote(notesData);
            setTimeout(() => {
                setSuccess(null);
                setnote(null);
            }, 5000);
        } catch (error) {
            setError('Error creating notes');
        }
    };

    const handleNotesUpdate = updatedNote => {
        try {
            setSuccess('Notes updated successfully!');
            setClassData(prev => {
                const updatedNotes = prev.notes.map(note =>
                    note._id === updatedNote._id ? { ...updatedNote, ...note } : note
                );
                return {
                    ...prev,
                    notes: updatedNotes,
                };
            });
            setTimeout(() => {
                setSuccess(null);
            }, 5000);
        } catch (error) {
            setError('Error updating quiz');
        }
    };

    const handleAddQuiz = quizData => {
        try {
            setShowCreateQuizModal(false);
            setSuccess('Quiz created successfully!');
            setClassData(prev => ({
                ...prev,
                quizzes: [...prev?.quizzes, quizData?._id]
            }));
            setquiz(quizData);
            setTimeout(() => {
                setSuccess(null);
                setquiz(null);
            }, 5000);
        } catch (error) {
            setError('Error creating quiz');
        }
    };

    const handleQuizUpdate = updatedQuiz => {
        try {
            setSuccess('Quiz updated successfully!');
            setClassData(prev => {
                const updatedQuizzes = prev.quizzes.map(quiz =>
                    quiz._id === updatedQuiz._id ? { ...updatedQuiz, ...quiz } : quiz
                );
                return {
                    ...prev,
                    quizzes: updatedQuizzes,
                };
            });
            setTimeout(() => {
                setSuccess(null);
            }, 5000);
        } catch (error) {
            setError('Error updating quiz');
        }
    };

    const handleCreateDiscussion = discussionData => {
        try {
            setShowCreateDiscussionModal(false);
            setSuccess('Discussion created successfully!');
            setClassData(prev => ({
                ...prev,
                discussions: [...prev?.discussions, discussionData?._id]
            }));
            setdiscussion(discussionData);
            setTimeout(() => {
                setSuccess(null);
                setdiscussion(null);
            }, 5000);
        } catch (error) {
            setError('Error creating discussion');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-screen-xl flex flex-col gap-6 mx-auto"
        >

            {/* Loading */}
            {loading && <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>}

            {/* Navbar */}
            <Navbar user={user} />

            {/* Back Button */}
            <div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Classes
                </button>
            </div>

            {/* Class Header */}
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-lg shadow-md p-6"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 line-clamp-1">
                            {classData?.title}
                        </h1>
                        <p className="text-gray-600 mb-4 line-clamp-2">{classData?.description}</p>
                        <div className="flex items-center text-gray-500">
                            <FiUsers className="mr-2" />
                            <span>
                                {classData?.students?.length || 0} {classData?.students?.length === 1 ? 'student' : 'students'} enrolled
                            </span>
                        </div>
                    </div>

                    {/* Three Dot Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiMoreVertical size={20} className="text-gray-500" />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                >
                                    {isInstructor ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(classData.classCode);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"

                                            >
                                                <FiCopy size={16} className="mr-2" />
                                                Copy Class Code
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingClass(classData);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <FiEdit className="mr-2" />
                                                Edit Class
                                            </button>
                                            <button
                                                onClick={() => handleAction('Delete Class')}
                                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                            >
                                                <FiTrash2 className="mr-2" />
                                                Delete Class
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleAction('leave')}
                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                        >
                                            <FiLogOut className="mr-2" />
                                            Leave Class
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Study Resources, Quizzes, Discussions Tabs */}
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex gap-6 items-center ${error || success ? 'justify-between' : 'justify-end'}`}
            >
                {/* Error Message */}
                {error && (
                    <div className="text-red-700 bg-red-100 px-3 py-1.5 rounded-md text-sm line-clamp-1">
                        Error: {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="text-green-700 bg-green-100 px-3 py-1.5 rounded-md text-sm line-clamp-1">
                        {success}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActive('Study Resources')}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${active === 'Study Resources'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Study Resources
                    </motion.button>
                    {!isInstructor && <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActive('Notes')}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${active === 'Notes'
                            ? 'bg-fuchsia-100 text-fuchsia-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Notes
                    </motion.button>}
                    <motion.button
                        whileHover={{ scale: 1.02 }}

                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActive('Quizzes')}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${active === 'Quizzes'
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >

                        Quizzes
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActive('Discussion')}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${active === 'Discussion'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Discussion
                    </motion.button>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white flex flex-col justify-between items-center h-[calc(100vh-200px)] overflow-y-auto scrollbar-styled rounded-lg shadow-md mb-6"
            >
                <div className="flex justify-between gap-4 items-center w-full px-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-900">{active}</h2>
                    <div className="flex gap-4">
                        {isInstructor && active === 'Study Resources' && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    classData?.resources?.length < 5
                                        ? setShowAddResourceModal(true)
                                        : setError('You can only add up to 5 resources per class');
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                <FiPlus className="mr-2" />
                                Add New Resource
                            </motion.button>
                        )}
                        {!isInstructor && active === 'Notes' && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowCreateNotesModal(true)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-fuchsia-600 rounded-md hover:bg-fuchsia-700"
                            >
                                <FiPlus className="mr-2" />
                                Create Notes
                            </motion.button>
                        )}
                        {isInstructor && active === 'Quizzes' && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    classData?.quizzes?.length < 5
                                        ? setShowCreateQuizModal(true)
                                        : setError('You can only add up to 5 quizzes per class');
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                                <FiPlus className="mr-2" />

                                Create New Quiz

                            </motion.button>

                        )}
                        {!isInstructor && active === 'Discussion' && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowCreateDiscussionModal(true)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                <FiPlus className="mr-2" />
                                Create Discussion
                            </motion.button>
                        )}

                        <SearchField
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder={`Search ${active}...`}
                        />
                    </div>
                </div>

                {active === 'Study Resources' && (
                    <StudyResources
                        classId={id}
                        isInstructor={isInstructor}
                        setError={setError}
                        resource={resource}
                        searchQuery={searchQuery}
                    />
                )}

                {active === 'Notes' && (
                    <NotesSection
                        classId={id}
                        setError={setError}
                        note={note}
                        onNotesUpdate={handleNotesUpdate}
                        searchQuery={searchQuery}
                    />
                )}

                {active === 'Quizzes' && (
                    <QuizzesSection
                        userId={user?._id}
                        classId={id}
                        isInstructor={isInstructor}
                        setError={setError}
                        quiz={quiz}
                        onQuizUpdate={handleQuizUpdate}
                        searchQuery={searchQuery}
                    />
                )}
                {active === 'Discussion' && (
                    <DiscussionSection
                        classId={id}
                        setError={setError}
                        discussion={discussion}
                        searchQuery={searchQuery}
                        userId={user?._id}
                        isInstructor={isInstructor}
                    />
                )}
            </motion.div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmDialog}
                title={confirmAction === 'Delete Class' ? 'Delete Class' : 'Leave Class'}
                message={
                    confirmAction === 'Delete Class'
                        ? "Are you sure you want to proceed?\n\n" +
                        "This will permanently delete the class and remove all enrolled students."
                        : "Are you sure you want to proceed?\n\n" +
                        "You will be removed from this class and will need a new class code to rejoin."
                }
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmDialog(false)}
                confirmText={confirmAction === 'Delete Class' ? 'Delete' : 'Leave'}
            />

            {/* Edit Class Modal */}
            <EditClassModal
                isOpen={!!editingClass}
                onClose={() => setEditingClass(null)}
                onEdit={handleEditClass}
                classData={editingClass}
            />

            {/* Add Resource Modal */}
            <AddResourceModal
                isOpen={showAddResourceModal}
                onClose={() => setShowAddResourceModal(false)}
                onSuccess={handleAddResource}
                classId={id}
            />

            {/* Create Notes Modal */}
            <CreateNotesModal
                isOpen={showCreateNotesModal}
                onClose={() => setShowCreateNotesModal(false)}
                onSuccess={handleCreateNotes}
                classId={id}
            />

            {/* Create Quiz Modal */}
            <CreateQuizModal
                isOpen={showCreateQuizModal}
                onClose={() => setShowCreateQuizModal(false)}
                onSuccess={handleAddQuiz}
                classId={id}
            />

            {/* Create Discussion Modal */}
            <CreateDiscussionModal
                isOpen={showCreateDiscussionModal}
                onClose={() => setShowCreateDiscussionModal(false)}
                onSuccess={handleCreateDiscussion}
                classId={id}
            />

        </motion.div >
    );
};

export default Class; 