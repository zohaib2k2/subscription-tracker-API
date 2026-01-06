import logger from "../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};
        error.message = err.message;

        // Log the error details
        logger.error(`Error Message: ${error.message}, Stack: ${err.stack}`);

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = `Resource not found with id of ${err.value}`;
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            const message = `Validation error: ${messages.join(', ')}`;
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({success: false,error: error.message || 'Server Error'});
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

export default errorMiddleware;