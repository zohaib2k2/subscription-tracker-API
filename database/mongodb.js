import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";
import logger from "../config/logger.js"

if(!DB_URI) {
    throw new Error("Please define MONGODB URI inside the development/production enviroment");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        logger.info(`Connecting to the database in ${NODE_ENV} mode.`);
    } catch (error) {
        console.log("Error connecting to database!", error);
        process.exit(1);
    }
    logger.info("Connected to the database!");
}

export default connectToDatabase;