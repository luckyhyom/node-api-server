import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
// import tweetsRouter from './router/tweetsRouter.js'
import tweetsRouter from './router/tweets.js'
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());

app.use('/tweets',tweetsRouter);

app.use((req,res,next) => {
    res.sendStatus(404);
})
app.use((error,req,res,next) => {
    // 에러로그 받기.
    console.error(error);
    res.sendStatus(500);
})

app.listen(8080);