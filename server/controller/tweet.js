/**
 * req,res를 import없이 쓸 수 있나?
 * res를 그냥 받아서 쓸수가 있다고?
 * 
 * 1. 하나의 시스템이라면 동기적이어도 문제가 없나?
 *    어쨌든 서버와 연동되면 값을 언제 받을지 모르기때문에 비동기여야함!
 * 
 * 2. 함수마다 동일한 코드가 계속해서 중복되면, '중요한' 내용을 한눈에 알아보기 어렵다.
 */
export class TweetController {
    constructor(tweetRepository, getSocketIO) {
        this.tweetRepository = tweetRepository;
        this.getSocketIO = getSocketIO;
    }

    async getTweets(req, res, next) {
        const username = req.query.username;
        const data = await (username
            ? this.tweetRepository.getAllByUsername(username)
            : this.tweetRepository.getAll());
    
        res.status(200).json(data);
    }
    
    async getById(req, res) {
        const id = req.params.id;
        const tweet = await this.tweetRepository.getById(id);
        if (tweet) {
            res.status(200).json(tweet);
        } else {
            res.status(404).json({ message: `Tweet id(${id}) not found` });
        }
    }
    
    async create (req, res) {
        const { text } = req.body;
        const tweet = await this.tweetRepository.create(text, req.userId);
        res.status(201).json(tweet);
        this.getSocketIO().emit('tweets', tweet);
    }
    
    async update (req, res) {
        const id = req.params.id;
        const text = req.body.text;
        const tweet = await this.tweetRepository.getById(id);
        if (!tweet) {
            return res.sendStatus(404);
        }
        if (tweet.userId !== req.userId) {
            // 401: 비로그인, 403: 권한문제
            return res.status(403).json({message:"hate you~"});
        }
    
        const updated = await this.tweetRepository.update(id,text);
        res.status(200).json(updated);
    }
    
    async remove(req, res) {
        const id = req.params.id;
    
        const tweet = await this.tweetRepository.getById(id);
        if (!tweet) {
            return res.sendStatus(404);
        }
        if (tweet.userId !== req.userId) {
            // 401: 비로그인, 403: 권한문제
            return res.status(403).json({message:"hate you~"});
        }
    
        await this.tweetRepository.remove(id);
        res.sendStatus(204);
    }
}


