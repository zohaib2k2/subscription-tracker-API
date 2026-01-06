
import mongoose from 'mongoose';
import User from '../models/users.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

export const signUp = async (req, res, next) => {
    // Implement sigu-up logic here.
    // its a session transation example
    // Database has to be atomic in this case
    // which means either all operations succeed or none do
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // logic to create a new user
        // const newUser = new User({...});
        // await newUser.save({ session });
        // req body is an object containing data from the client (POST request)
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            const error = new Error("User already exists with this email");
            error.statusCode = 409;
            throw error;
        }

        // Hash the password for the new user.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name,email,password: hashedPassword}], { session });

        const token = jwt.sign({ userId: newUsers[0]._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });



        await session.commitTransaction();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                token,
                user: newUsers[0],
            }
        });

        session.endSession();
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

};

export const signIn = async (req, res, next) => {
    // Implement sign-in logic here.
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId:user._id}, JWT_SECRET, {expiresIn:JWT_EXPIRES_IN});

        res.status(200).json({
            success:true,
            message:"User signed in successfully",
            data:{
                token,
                user,
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    // Implement sign-out logic here.

}