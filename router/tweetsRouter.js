import express from 'express';

const router = express.Router();
let tweets = [
    {
        id:'1',
        text:'first message',
        name:'bob',
        username:'Bob',
        createdAt: Date.now().toString(),
        // url:
    },
    {
        id:'2',
        text:'second message',
        name:'min',
        username:'Min',
        createdAt: Date.now().toString(),
        // url:
    },

]

// GET tweets
// GET tweets?username=
// GET tweets/:id
// POST tweets
// PUT tweets/:id
// DELETE tweets/:id

// username으로 등록된 목록
router.get('/',(req,res,next) => {
    const username = req.query.username;
    const data = username ? tweets.filter(f=> f.username === username)
    : tweets;

    res.status(200).json(data);
});

// 특정 트윗의 id 검섹
router.get('/:id',(req,res,next) => {
    const id = req.params.id;
    // 배열안의 객체들을 검색할때..
    const data = tweets.find((t) => t.id === id);
    console.log(id,data,tweets);
    if(!data){
        res.status(404).json({error:`tweet id(${id} is not found)`})
    }else{
        res.json(data);
    }
});

router.post('/',(req,res,next) => {
    const {text,name,username} = req.body;
    const tweet = {
        id: Date.now().toString(),
        name,
        username,
        text,
        createdAt: new Date(),
    }

    tweets = [tweet, ...tweets];
    
    res.status(200).json(tweet);
});
router.put('/:id',(req,res,next) => {
    
    const id = req.params.id;
    const {text} = req.body;

    // 복사 후에 업데이트
    // 얕은 복사.
    const target = tweets.find(tweet => tweet.id === id);

    if(!target){
        res.status(404).json({message:`tweet id(${id}) is not found`})
    }

    // const update = {
    //     ...target, text, updatedAt: new Date()
    // }
    
    // let newTweets = tweets.filter(f=>f.id !== id);
    // tweets = [update, ...newTweets];
    
    target.text = text; // 얕은 복사 이므로..
    res.status(200).json(target);

});
router.delete('/:id',(req,res,next) => {
    const id = req.params.id;
    // 배열안의 객체들을 검색할때..
    const data = tweets.find(t=>t.id === id);
    
    if(!data){
        res.status(404).json({error:`tweet id(${id}) is not found`})
    }else{
        const result = tweets.filter( f => f.id !== data.id);
        tweets = result;
        console.log(tweets);
        res.sendStatus(201);
    }
});

export default router;