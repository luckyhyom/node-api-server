//12:26 AM

import express from 'express';
import MessageRouter from './router/messageRouter.js';
const app = express();
app.use(express.json());

app.use('/message',MessageRouter);

app.listen(8080);