import jwt from 'jsonwebtoken';
import fs from 'fs';
import os from 'os';
import path from 'path';
// import bcrypt from 'bcrypt';
import * as userRepository from '../data/user.js';


/**
 * 1. 로그인 할때 body를 받나?
 * 2. 그럼 post인가?
 * 3. get에 바디 가능?
 */

export function login(req, res, next) {
    const { userId, password } = req.body;
    const result = userRepository.find(userId,password);

    if(!result) {
        res.json({message:'error'});
    }

    const token = jwt.sign({
        id: userId,
        admin: true,
        exp: 60,
    },'thisissecret');

    fs.writeFileSync(`./token/${userId}`,token);

    // 토큰을 어떻게 클라이언트가 가지고있지?
    // 토큰을 비교하려면 서버도 가지고있어야함.
    // 토큰으로 사용자 인증하기
    res.json(token);
};

export async function join(req, res, next) {
    const result = await userRepository.join(req);
    res.status(201).json(result);
};