/**
 * req,res를 import없이 쓸 수 있나?
 * res를 그냥 받아서 쓸수가 있다고?
 * 
 * 1. 하나의 시스템이라면 동기적이어도 문제가 없나?
 *    어쨌든 서버와 연동되면 값을 언제 받을지 모르기때문에 비동기여야함!
 * 
 * 2. 함수마다 동일한 코드가 계속해서 중복되면, '중요한' 내용을 한눈에 알아보기 어렵다.
 */

import * as tweetRepository from '../data/tweet.js';

export async function getTweets(req, res, next) {
    // username의 유무에 따라 결과가 다른데, 메소드도 두개여야하나?
    // tweetrepository는 controller로 옮겨지나?
    // 라우트에서 파라미터에 tweetrepository를 넣는건가?
    // 그렇게 되면 라우트는 약간 서비스의 느낌인가? 컨트롤러와 서비스를 이어주는

    const username = req.query.username;
    const data = await (username
        ? tweetRepository.getAllByUsername(username)
        : tweetRepository.getAll());

        console.log(data);

    res.status(200).json(data);
}

export async function getById(req, res) {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if (tweet) {
    res.status(200).json(tweet);
    } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
}

export async function create (req, res) {
    const { text } = req.body;
    const tweet = await tweetRepository.create(text, req.userId);
    res.status(201).json(tweet);
}

export async function update (req, res) {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = await tweetRepository.getById(id);
    if (!tweet) {
        return res.sendStatus(404);
    }
    if (tweet.userId !== req.userId) {
        // 401: 비로그인, 403: 권한문제
        return res.status(403).json({message:"fuck you~"});
    }

    const updated = await tweetRepository.update(id,text);

    res.status(200).json(updated);
}

export async function remove(req, res) {
    const id = req.params.id;

    const tweet = await tweetRepository.getById(id);
    if (!tweet) {
        return res.sendStatus(404);
    }
    if (tweet.userId !== req.userId) {
        // 401: 비로그인, 403: 권한문제
        return res.status(403).json({message:"fuck you~"});
    }
    
    await tweetRepository.remove(id);
    res.sendStatus(204);
}