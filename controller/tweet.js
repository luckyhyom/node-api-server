/**
 * req,res를 import없이 쓸 수 있나?
 * res를 그냥 받아서 쓸수가 있다고?
 */

import * as tweetRepository from '../data/tweet.js';

export function getTweets(req, res, next) {
    // username의 유무에 따라 결과가 다른데, 메소드도 두개여야하나?
    // tweetrepository는 controller로 옮겨지나?
    // 라우트에서 파라미터에 tweetrepository를 넣는건가?
    // 그렇게 되면 라우트는 약간 서비스의 느낌인가? 컨트롤러와 서비스를 이어주는

    const username = req.query.username;
    const data = username
        ? tweetRepository.getByUsername(username)
        : tweetRepository.getAll();

    res.status(200).json(data);
}

export function getById(req, res) {
    const id = req.params.id;
    const tweet = tweetRepository.getById(id);
    if (tweet) {
    res.status(200).json(tweet);
    } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
}

export function create (req, res) {
    const { text, name, username } = req.body;
    const tweet = tweetRepository.create(name,username,text);
    res.status(201).json(tweet);
}

export function update (req, res) {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = tweetRepository.update(id,text);

    if (tweet) {
        res.status(200).json(tweet);
    } else {
        res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
}

export function remove(req, res) {
    const id = req.params.id;
    tweetRepository.remove(id);
    res.sendStatus(204);
}