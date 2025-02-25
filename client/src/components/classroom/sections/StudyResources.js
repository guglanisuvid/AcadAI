import React, { useState, useEffect } from 'react';
import ResourceCard from '../cards/ResourceCard';

const StudyResources = ({ setError, classId, isInstructor, resource, searchQuery }) => {
    const [resources, setResources] = useState([]);
    const [filterResources, setFilterResources] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(
                    `${API_URL}/api/resources/class/${classId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setLoading(false);
                    setError(data.message || 'Failed to fetch resources');
                    return;
                }

                if (Array.isArray(data)) {
                    // Remove duplicates based on _id
                    setResources(prev => {
                        const uniqueResources = [...prev];
                        data.forEach(resource => {
                            if (!uniqueResources.find(r => r._id === resource._id)) {
                                uniqueResources.push(resource);
                            }
                        });
                        return uniqueResources;
                    });
                }
            } catch (error) {
                setError("Failed to fetch resources: " + error.message);
            } finally {
                setLoading(false);
            }

        };
        fetchResources();

    }, []);

    useEffect(() => {
        if (resource) {
            setResources(prev => [resource, ...prev]);
        }
    }, [resource]);

    useEffect(() => {
        setFilterResources(resources.filter(resource =>
            resource?.title.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            resource?.description.toLowerCase().includes(searchQuery?.toLowerCase())
        ));
    }, [searchQuery, resources]);

    const handleDeleteResource = (resourceId) => {
        try {
            setResources(prev => prev.filter(resource => resource._id !== resourceId));
        } catch (error) {
            setError(error.message || 'Failed to delete resource');
        }
    };

    return (
        <div className="w-full h-full p-6 overflow-y-auto scrollbar-hide">

            {/* Loading */}
            {loading && <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>}

            {/* Resources */}
            <div className={`${filterResources.length ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'h-full'}`}>
                {searchQuery === '' && filterResources.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No resources uploaded yet</p>
                    </div>
                )}

                {searchQuery !== '' && filterResources.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No resources found related to search query</p>
                    </div>
                )}

                {filterResources.map(resource => (
                    <ResourceCard
                        key={resource._id}
                        resource={resource}
                        isInstructor={isInstructor}
                        setError={setError}
                        onDelete={handleDeleteResource}
                    />
                ))}
            </div>
        </div>
    );
};


export default StudyResources; 