import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import ClassesGallery from '../classroom/sections/ClassesGallery';
import useClassSearch from '../../hooks/useClassSearch';
import ConfirmationModal from '../modals/ConfirmationModal';

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const { setClasses, filteredClasses, handleSearch } = useClassSearch([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [, setConfirmAction] = useState(null);
    const [id, setId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/classes`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    setError(errorData?.message);
                }

                const data = await response.json();
                setClasses(data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [setClasses]);

    const handleConfirmAction = (action, classId) => {
        setConfirmAction(action);
        setId(classId);
        setShowConfirmDialog(true);
    };

    const handleLeaveClass = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/classes/${id}/leave`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });


            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            // Remove class from state
            setClasses(prevClasses => prevClasses.filter(c => c._id !== id));
            setShowConfirmDialog(false);

        } catch (error) {
            setError(error.message);
            setShowConfirmDialog(false);
        }
    };

    const handleJoinClass = (joinedClass) => {
        setClasses(prevClasses => [...prevClasses, joinedClass]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DashboardHeader
                isInstructor={false}
                onSearch={handleSearch}
                onJoinClass={handleJoinClass}
            />
            {error && <div className="text-red-500">{error}</div>}
            <ClassesGallery
                loading={loading}
                classes={filteredClasses}
                isInstructor={false}
                onConfirmAction={handleConfirmAction}
                onLeave={handleLeaveClass}
            />
            <ConfirmationModal

                isOpen={showConfirmDialog}
                title='Leave Class'
                message={
                    "Are you sure you want to proceed?\n\n" +
                    "You will be removed from this class and will need a new class code to rejoin."
                }
                onConfirm={handleLeaveClass}
                onCancel={() => setShowConfirmDialog(false)}
                confirmText='Leave'

            />


        </div>
    );
};

export default StudentDashboard; 