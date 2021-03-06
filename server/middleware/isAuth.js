import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import config from '../config.js';

/**
 * 도중에 요청을 넘겨받아서 처리하는 '미들웨어'
 */

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {

    const authHeader = req.get('Authorization');
    if(!(authHeader && authHeader.startsWith('Bearer '))) {
        return res.status(401).json(AUTH_ERROR);
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        config.jwt.secretKey,
        async (err, decoded) => {
            if(err) {
                return res.status(401).json(AUTH_ERROR)
            }
            const user = await userRepository.findById(decoded.id);
            if (!user) {
                return  res.status(401).json(AUTH_ERROR);
            }
            // 토큰을 보내서 회원 정보 키를 얻는다, 키를 이용해 회원 정보를 얻는다.
            req.userId = user.id; // req.customData
            req.token = token;
            next();
        }
    )
}