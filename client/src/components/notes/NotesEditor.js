import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotesEditorSetup from './NotesEditorSetup';

const NotesEditor = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                setLoading(true);
                setError(null);

                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

                const response = await fetch(`${API_URL}/api/notes/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || 'Failed to create note');
                    setLoading(false);
                    return;
                }

                setNote(
                    {
                        title: data?.notes?.title,
                        creator: data?.notes?.creator,
                        classId: data?.notes?.classId,
                        createdAt: data?.notes?.createdAt
                    }
                );

                setContent(data?.notes?.content);

            } catch (error) {
                setError(error.message || 'Error creating note');
            } finally {
                setLoading(false);
            }
        }

        fetchNote();
    }, []);

    const handleSaveNote = async () => {
        try {
            setError(null);
            setSaving(true);

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/notes/${id}/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to save note');
                setLoading(false);
                return;
            }

            setContent(data?.content);

        } catch {
            setError(error.message || 'Error saving note');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-screen-xl h-[110dvh] flex flex-col min-h-screen mx-auto py-4"
        >
            {/* Back Button */}
            <div className='flex justify-between items-center gap-6'>
                <div className='w-full flex justify-between items-center gap-6'>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Class
                    </button>
                </div>
                {/* Error Message */}
                {
                    error
                    &&
                    (
                        <div className="text-red-700 bg-red-100 px-3 py-1.5 rounded-md text-sm line-clamp-1">
                            Error: {error}
                        </div>
                    )
                }
            </div>

            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className='w-full h-full overflow-y-auto scrollbar-hide bg-white rounded-lg shadow-md mt-4 p-6'
            >
                {/* Loading */}
                {
                    loading && <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                }

                <div>
                    <div className='flex gap-6 items-center justify-between'>
                        <div className='w-full'>
                            {/* Title */}
                            <h2 className="text-3xl font-semibold text-gray-800 line-clamp-1">
                                {note?.title}
                            </h2>
                            {/* Date */}
                            <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                                {
                                    new Date(note?.createdAt).toLocaleString('en-US', {
                                        timeZone: 'Asia/Kolkata',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })
                                }
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSaveNote();
                            }}
                            className="flex items-center bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded-md"
                        >
                            <FiSave className="mr-2" />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    <br /><hr /><br />
                </div>

                {/* Editor */}
                <div className='text-[#333333]'>
                    <NotesEditorSetup
                        content={content}
                        setContent={setContent}
                    />
                </div>

            </motion.div>
        </motion.div>
    );
};

export default NotesEditor;