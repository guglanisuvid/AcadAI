import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import ClassesGallery from '../classroom/sections/ClassesGallery';
import useClassSearch from '../../hooks/useClassSearch';
import EditClassModal from '../modals/EditClassModal';
import ConfirmationModal from '../modals/ConfirmationModal';

const InstructorDashboard = () => {
    const [loading, setLoading] = useState(true);
    const { setClasses, filteredClasses, handleSearch } = useClassSearch([]);
    const [editingClass, setEditingClass] = useState(null);
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
                    throw new Error(`Failed to fetch classes: ${errorData}`);
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


    const handleDeleteClass = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/classes/${id}/delete`, {
                method: 'DELETE',
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

    const copyClassCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleCreateClass = (newClass) => {
        setClasses(prevClasses => [...prevClasses, newClass]);
    };

    const handleEditClass = (updatedClass) => {
        setClasses(prevClasses =>
            prevClasses.map(c =>
                c._id === updatedClass._id ? updatedClass : c
            )
        );
        setEditingClass(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DashboardHeader
                isInstructor={true}
                onSearch={handleSearch}
                onCreateClass={handleCreateClass}
            />
            {error && <div className="text-red-500">{error}</div>}
            <ClassesGallery
                loading={loading}
                classes={filteredClasses}
                onCopyCode={copyClassCode}
                isInstructor={true}
                onConfirmAction={handleConfirmAction}

                onEdit={setEditingClass}
            />
            <EditClassModal
                isOpen={!!editingClass}
                onClose={() => setEditingClass(null)}
                onEdit={handleEditClass}
                classData={editingClass}
            />
            <ConfirmationModal
                isOpen={showConfirmDialog}
                title='Delete Class'
                message={
                    "Are you sure you want to proceed?\n\n" +
                    "This will permanently delete the class and remove all enrolled students."
                }
                onConfirm={handleDeleteClass}
                onCancel={() => setShowConfirmDialog(false)}
                confirmText='Delete'



            />
        </div>
    );
};

export default InstructorDashboard;
