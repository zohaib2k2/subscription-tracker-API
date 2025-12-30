
import express from 'express';
import {PORT} from './config/env.js'


const app = express();


app.get('/', (req, res) => {
    res.send('<h1 style="color:green;padding:5rem;margin:4rem">Welcome to the subscription tracker API</h1>');
});

app.listen(PORT, () => {
    console.log(`Subscription-traction API server running on port ${PORT}`)}
);

export default app;