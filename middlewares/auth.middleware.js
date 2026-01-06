
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/users.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            const error = new Error('Not authorized to access this route');
            error.statusCode = 401;
            throw error;
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            const error = new Error('No user found with this id');
            error.statusCode = 404;
            throw error;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({message:'unathorized',error: error.message});
    }
}

export default authorize;