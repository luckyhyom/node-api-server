
import express from 'express';
import * as authController from '../controller/auth.js';

const router = express.Router();

router.get('/login',authController.login);

router.post('/join',authController.join);

router.get('/me', (req, res, next) => {

});

export default router;