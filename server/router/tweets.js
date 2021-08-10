import express from 'express';
import 'express-async-errors';
import {body} from 'express-validator';
import * as tweetController from '../controller/tweet.js';
import {validate} from '../middleware/validator.js';
import {isAuth} from '../middleware/isAuth.js';


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
 * 결론
 * M: 데이터를 가지고 있음
 * V: 네비게이터
 * C: 로직
 */


const router = express.Router();

const validateTweet = [
  body('text').isLength({min:3}).withMessage('too short!'),
  validate
]

/**
 *   1. 함수 실행()의 값이 아닌, 함수를 연결
 *   2. req,res는 어떻게 전달하는거지?
 *   3. View에는 진짜 순수하게 Router만 남기는구나..
 *      모든 로직을 함수 이름으로 숨기고 위치만 찍어준다.
 * -> 말그대로 위치만 알려주는 역할을 한다. 어떤 주소로 요청이 오면, 어떤 api를 쓸거야.
 */

// GET /tweets
// GET /tweets?username=:username
router.get('/', isAuth, tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', isAuth, tweetController.getById);

// POST /tweeets
router.post('/', isAuth, validateTweet, tweetController.create);

// PUT /tweets/:id
router.put('/:id', isAuth, tweetController.update);

// DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.remove);

export default router;
