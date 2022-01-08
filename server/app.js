import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
// import tweetsRouter from './router/tweetsRouter.js'
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { initSocket, getSocketIO } from './connection/socket.js';
import config from './config.js';
import { sequelize } from './db/database.js';
import { TweetController } from './controller/tweet.js';
import * as tweetRepository from './data/tweet.js';

/**
 * 
 * .env파일의 내용을 process.env에 로드함
 * -> 서버를 킬 때마다 export로 환경변수를 설정하지 않아도 .env를 자동으로 읽어서 설정한다.
 * token-expires 설정같은 경우에는 이렇게 관리해서 무슨 이점이 있는거지?
 * 
 * process는 전역변수다. 어느 파일에서든 사용 가능.
 */

const corsOption = {
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200,
}
export async function startServer() {
    const app = express();

    app.use(express.json());
    app.use(helmet());
    app.use(cors(corsOption));
    app.use(morgan('tiny'));

    app.use('/tweets',
        tweetsRouter(new TweetController(tweetRepository, getSocketIO))
    );
    app.use('/auth',authRouter);

    app.use((req,res,next) => {
        res.sendStatus(404);
    })

    app.use((error,req,res,next) => {
        // 에러로그 받기.
        console.error(error);
        res.sendStatus(500);
    });

    await sequelize.sync();
    console.log(`Server is started... ${new Date()}`);
    const server = app.listen(config.port);
    initSocket(server)

    return server;
}

export async function stopServer(server) {
    return new Promise((resolve, reject) => {
        server.close(async () => {
            try {
                await sequelize.stop();
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    })
}
