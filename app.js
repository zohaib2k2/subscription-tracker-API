
import express from 'express';
import {PORT} from './config/env.js'

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';


const app = express();


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscription',subscriptionRouter);


app.get('/', (req, res) => {
    res.send('<h1 style="color:green;padding:5rem;margin:4rem">Welcome to the subscription tracker API</h1>');
});

app.listen(PORT, () => {
    console.log(`Subscription-traction API server running on port ${PORT}`)}
);

export default app;