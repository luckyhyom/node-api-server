import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import config from '../config.js'

/**
 * 1. 로그인 할때 body를 받나?
 * 2. 그럼 post인가?
 * 3. get에 바디 가능?
 * 4. repository에서는 단순 crud기능만하고, 암호 처리는 컨트롤러에서 한다.
 */

const jwtSecretKey = config.jwt.secretKey;
const jwtExpiresInDays = config.jwt.expires;
const BcryptSaltRounds =  config.bCrypt.salt;


export async function login(req, res, next) {
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);
    if(!user) {
        return res.status(401).json({message:'Invalid User or Password'});
    }
    const isValidPassword = await bcrypt.compareSync(password,user.password);
    if(!isValidPassword) {
        // res를 두번 호출하지 않기 위해 return을 이용해 함수를 탈출.
        return res.status(401).json({message:'Invalid User or Password'});
    }
    const token = createJwtToken(user.id);
    
    // 토큰을 어떻게 클라이언트가 가지고있지?
    // 토큰을 비교하려면 서버도 가지고있어야함.
    // 토큰으로 사용자 인증하기
    res.json({ token, username });
};

export async function signup(req, res, next) {
    const { username, password, name, email, url } = req.body;
    const found = await userRepository.findByUsername(username);
    if(found) {
        res.status(409).json({message: `${username} already exists`})
    }
    const hashed = await bcrypt.hash(password, BcryptSaltRounds);
    const userInfo = { username, password: hashed, name, email, url };
    const userId = await userRepository.createUser(userInfo);

    const token = createJwtToken(userId);
    res.status(201).json({ token, userId });
};

export async function me(req, res, next) {
    const user = await userRepository.findById(req.userId);
    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({ token: req.token, username: user.username});
}

function createJwtToken(id) {
    return jwt.sign({
        id,
        admin: true,
    },jwtSecretKey ,{ expiresIn: jwtExpiresInDays });
}
