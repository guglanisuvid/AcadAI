import React, { useEffect, useState } from 'react';
import NotesCard from '../cards/NotesCard';

const NotesSection = ({ setError, classId, note, onNotesUpdate, searchQuery }) => {

    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                setError(null);
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/notes/class/${classId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setLoading(false);
                    setError(data.message || 'Failed to fetch notes');
                    return;
                }

                setNotes(data?.notes);

            } catch (error) {
                setError("Failed to fetch resources: " + error.message);
            } finally {
                setLoading(false);
            }

        };
        fetchNotes();

    }, []);

    useEffect(() => {
        if (note) {
            setNotes(prev => [note, ...prev]);
        }
    }, [note]);

    useEffect(() => {
        setFilteredNotes(notes.filter(note =>
            note?.title?.toLowerCase().includes(searchQuery?.toLowerCase())
        ));
    }, [searchQuery, notes]);

    const handleNoteUpdate = (updatedQuiz) => {
        try {
            setNotes(prev => prev.map(note => note._id === updatedQuiz._id ? updatedQuiz : note));
        } catch (error) {
            setError(error.message || 'Failed to update notes');
        }
    };

    const handleDeleteNote = (resourceId) => {
        try {
            setNotes(prev => prev.filter(resource => resource._id !== resourceId));
        } catch (error) {
            setError(error.message || 'Failed to delete notes');
        }
    };

    return (
        <div className='w-full h-full flex flex-col p-6 overflow-y-auto scrollbar-hide'>

            {/* Loading */}
            {loading && <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>}

            {/* Quizzes */}
            <div className={`${filteredNotes.length ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'h-full'}`}>
                {searchQuery === '' && filteredNotes.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No notes created yet</p>
                    </div>
                )}

                {searchQuery !== '' && filteredNotes.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No notes found related to search query</p>
                    </div>
                )}

                {filteredNotes.map(note => (
                    <NotesCard
                        key={note._id}
                        note={note}
                        setError={setError}
                        onDelete={handleDeleteNote}
                        onNotesUpdate={(updatedNotes) => {
                            handleNoteUpdate(updatedNotes);
                            onNotesUpdate(updatedNotes);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotesSection;