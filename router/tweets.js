import express from 'express';
import 'express-async-errors';
import * as tweetRepository from '../data/tweet.js';

/**
 * MVC 패턴에 맞춰 수정중
 * 
 * 1. JSON 파일 가져오는 법 모름
 * -> js였음
 * 
 * 2. controller 분리하는 기준 모름
 * -> 간단한 로직이라도 모두 기능별로 나누어 함수로 만들어서 숨긴다. (함수의 이름만 정하고, 로직은 그래도 옮기면 된다. 이름부터 정해도 된다.)
 * 'tweets' 라는 '데이터'를 가지고 map,find,filter등의 CRUD작업을 했던 것들을 패키징하여 data폴더에 분류한다.
 * 
 */


const router = express.Router();

// GET /tweets
// GET /tweets?username=:username
router.get('/', (req, res, next) => {
  const username = req.query.username;
  const data = username
    ? tweetRepository.getByUsername(username)
    : tweetRepository.getAll();
  res.status(200).json(data);
});

// GET /tweets/:id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const tweet = tweetRepository.getById(id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});

// POST /tweeets
router.post('/', (req, res, next) => {
  const { text, name, username } = req.body;
  const tweet = tweetRepository.create(name,username,text);
  res.status(201).json(tweet);
});

// PUT /tweets/:id
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = tweetRepository.update(id,text);
  
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});

// DELETE /tweets/:id
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  tweetRepository.remove(id);
  res.sendStatus(204);
});

export default router;
