const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {
    // Protect routes
    protect: async (req, res, next) => {
        try {
            let token;

            // Check for token in headers
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                return res.status(401).json({
                    message: 'Not authorized, no token',
                    success: false
                });
            }

            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Find user by id from token
                const user = await User.findById(decoded.id || decoded.userId);

                if (!user) {
                    return res.status(401).json({
                        message: 'User not found',
                        success: false
                    });
                }

                // Attach user to request
                req.user = user;
                next();
            } catch (error) {
                return res.status(401).json({
                    message: 'Not authorized, token failed',
                    success: false
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'Server error in auth middleware',
                success: false
            });
        }
    },

    // Instructor only middleware
    instructor: (req, res, next) => {
        if (req.user && req.user.role === 'instructor') {
            next();
        } else {
            res.status(403).json({
                message: 'Not authorized as instructor',
                success: false
            });
        }
    },

    // Student only middleware
    student: (req, res, next) => {
        if (req.user && req.user.role === 'student') {
            next();
        } else {
            res.status(403).json({
                message: 'Not authorized as student',
                success: false
            });
        }
    }
};

module.exports = auth;