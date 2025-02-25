const AppError = require('../utils/AppError');

const errorHandler = {
    // Development error response
    developmentErrors: (err, res) => {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    },

    // Production error response
    productionErrors: (err, res) => {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // Programming or other unknown error: don't leak error details
        else {
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!'
            });
        }
    },

    // Main error handling middleware
    globalErrorHandler: (err, req, res, next) => {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';

        if (process.env.NODE_ENV === 'development') {
            errorHandler.developmentErrors(err, res);
        } else {
            let error = { ...err };
            error.message = err.message;

            // Mongoose duplicate key error
            if (err.code === 11000) {
                error = new AppError(`Duplicate field value: ${Object.keys(err.keyValue)}`, 400);
            }

            // Mongoose validation error
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map(el => el.message);
                error = new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
            }

            // Mongoose cast error
            if (err.name === 'CastError') {
                error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
            }

            // JWT error
            if (err.name === 'JsonWebTokenError') {
                error = new AppError('Invalid token. Please log in again!', 401);
            }

            // JWT expired error
            if (err.name === 'TokenExpiredError') {
                error = new AppError('Your token has expired! Please log in again.', 401);
            }

            errorHandler.productionErrors(error, res);
        }
    }
};

module.exports = errorHandler;