import React from 'react';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';
import Navbar from '../layout/Navbar';

const Dashboard = ({ user }) => {

    return (
        <>
            <Navbar user={user} />
            {user?.role === 'instructor' ? (
                <InstructorDashboard />
            ) : (
                <StudentDashboard />
            )}
        </>
    );
};

export default Dashboard;
