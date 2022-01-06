import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import { isAuth } from '../middleware/isAuth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const validateTweet = [
	body('text')
		.trim()
		.isLength({ min: 3 })
		.withMessage('text should be at least 3 characters'),
	validate,
];

export default function tweetsRouter(tweetController) {
	// GET /tweet
	// GET /tweets?username=:username
	router.get('/', isAuth, tweetController.getTweets);

	// GET /tweets/:id
	router.get('/:id', isAuth, tweetController.getTweets);

	// POST /tweeets
	router.post('/', isAuth, validateTweet, tweetController.create);

	// PUT /tweets/:id
	router.put('/:id', isAuth, validateTweet, tweetController.update);

	// DELETE /tweets/:id
	router.delete('/:id', isAuth, tweetController.remove);
};
