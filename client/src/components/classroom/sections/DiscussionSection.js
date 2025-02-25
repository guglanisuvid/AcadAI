import React, { useEffect, useState } from 'react';
import DiscussionCard from '../cards/DiscussionCard';

const DiscussionSection = ({ setError, classId, discussion, searchQuery, userId, isInstructor }) => {
    const [discussions, setDiscussions] = useState([]);
    const [filteredDiscussions, setFilteredDiscussions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                setLoading(true);
                setError(null);
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/discussions/class/${classId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setLoading(false);
                    setError(data.message || 'Failed to fetch discussions');
                    return;
                }

                setDiscussions(data?.discussions);

            } catch (error) {
                setError("Failed to fetch discussions: " + error.message);
            } finally {
                setLoading(false);
            }

        };
        fetchDiscussions();

    }, []);

    useEffect(() => {
        if (discussion) {
            setDiscussions(prev => [discussion, ...prev]);
        }
    }, [discussion]);

    useEffect(() => {
        setFilteredDiscussions(discussions.filter(discussion =>
            discussion?.question?.toLowerCase().includes(searchQuery?.toLowerCase())
        ));
    }, [searchQuery, discussions]);

    const handleDeleteDiscussion = (discussionId) => {
        try {
            setDiscussions(prev => prev.filter(discussion => discussion._id !== discussionId));
        } catch (error) {
            setError(error.message || 'Failed to delete discussions');
        }
    };

    return (
        <div className='w-full h-full flex flex-col p-6 overflow-y-auto scrollbar-hide'>

            {/* Loading */}
            {loading && <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>}

            {/* Quizzes */}
            <div className={`${filteredDiscussions.length ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'h-full'}`}>
                {searchQuery === '' && filteredDiscussions.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No discussions uploaded yet</p>
                    </div>
                )}

                {searchQuery !== '' && filteredDiscussions.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No discussions found related to search query</p>
                    </div>
                )}

                {filteredDiscussions.map(discussion => (
                    <DiscussionCard
                        key={discussion._id}
                        discussion={discussion}
                        setError={setError}
                        onDelete={handleDeleteDiscussion}
                        userId={userId}
                        isInstructor={isInstructor}
                    />
                ))}
            </div>
        </div>
    );
};

export default DiscussionSection;