import React from 'react';
import ClassCard from '../cards/ClassCard';

const ClassesGallery = ({ loading, classes, onCopyCode, isInstructor, onEdit, onConfirmAction }) => {
    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (classes.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No classes found
            </div>
        );
    }

    const handleAction = (action, classId) => {
        if (action === 'Delete Class' || action === 'Leave Class') {
            onConfirmAction(action, classId);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {classes.map((classItem) => (
                <ClassCard
                    key={classItem._id}
                    classItem={classItem}
                    onCopyCode={onCopyCode}
                    isInstructor={isInstructor}
                    onAction={handleAction}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default ClassesGallery; 