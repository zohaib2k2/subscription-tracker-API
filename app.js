
// Import packages
import express from 'express';
import cookieParser from 'cookie-parser';

// relative imports
import {PORT} from './config/env.js'
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscription',subscriptionRouter);


app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('<h1 style="color:green;padding:5rem;margin:4rem">Welcome to the subscription tracker API</h1>');
});

app.listen(PORT, async () => {

    console.log(`Subscription-traction API server running on port ${PORT}`)
    await connectToDatabase();
});

export default app;