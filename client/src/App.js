import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import GoogleCallback from './components/auth/GoogleCallback';
import RoleSelection from './components/auth/RoleSelection';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Logout from './components/auth/Logout';
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import Class from './components/classroom/Class';
import QuizAttempt from './components/quizzes/QuizAttempt';
import './styles/scrollbar.css';
import AttemptResult from './components/quizzes/AttemptResult';
import QuizAnalytics from './components/quizzes/QuizAnalytics';
import NotesEditor from './components/notes/NotesEditor';
import SeeDiscussion from './components/discussions/SeeDiscussion';
// import Settings from './components/auth/Settings';


function App() {
    const [user, setUser] = useState(null);

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    return (
        <div className="min-h-screen max-w-[2000px] bg-gradient-to-br from-blue-50 to-indigo-50">
            <Router>
                <Routes>
                    {/* Google callback route */}
                    <Route
                        path="/auth/google/callback"
                        element={
                            <GoogleCallback
                                updateUser={updateUser}
                            />
                        }
                    />

                    {/* Home route */}
                    <Route
                        path="/"
                        element={
                            <RedirectIfAuthenticated>
                                <Login />
                            </RedirectIfAuthenticated>
                        }
                    />

                    {/* Login route */}
                    <Route
                        path="/login"
                        element={
                            <RedirectIfAuthenticated>
                                <Login />
                            </RedirectIfAuthenticated>
                        }
                    />

                    {/* Role selection route */}
                    <Route
                        path="/role-selection"
                        element={
                            <ProtectedRoute>
                                {user?.role ? (
                                    <Dashboard
                                        user={user}
                                    />
                                ) : (
                                    <RoleSelection
                                        user={user}
                                        updateUser={updateUser}
                                    />
                                )}
                            </ProtectedRoute>
                        }
                    />

                    {/* Dashboard route */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard
                                    user={user}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* Logout route */}
                    <Route
                        path="/logout"
                        element={
                            <Logout
                                setUser={setUser}
                            />
                        }
                    />

                    {/* Classroom route */}
                    <Route
                        path="/classes/:id"
                        element={
                            <ProtectedRoute>
                                <Class
                                    user={user}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* Notes route */}
                    <Route
                        path="/notes/:id"
                        element={
                            <ProtectedRoute>
                                <NotesEditor />
                            </ProtectedRoute>
                        }
                    />

                    {/* Quiz attempt route */}
                    <Route
                        path="/quizzes/:quizId/attempt"
                        element={
                            <ProtectedRoute>
                                <QuizAttempt />
                            </ProtectedRoute>
                        }
                    />

                    {/* Quiz attempt result route */}
                    <Route
                        path="/quizzes/:quizId/attempt-result"
                        element={
                            <ProtectedRoute>
                                <AttemptResult
                                    user={user}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* Quiz analytics route */}
                    <Route
                        path="/quizzes/:quizId/analytics"
                        element={
                            <ProtectedRoute>
                                <QuizAnalytics
                                    user={user}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* See discussion route */}
                    <Route
                        path="/discussions/:discussionId"
                        element={
                            <ProtectedRoute>
                                <SeeDiscussion
                                    user={user}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* <Route path="/settings" element={<Settings />} /> */}

                </Routes>
            </Router>
        </div>
    );
}

export default App;