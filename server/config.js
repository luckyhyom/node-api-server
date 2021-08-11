/**
 * 1. 오타를 방지한다.
 * 2. 프로젝트 config를 한눈에 볼 수 있다.
 * 3. required함수를 통해, 정의되지 않는 환경변수일 경우 바로 알 수 있다.
 */

import dotenv from 'dotenv';
dotenv.config('.env');

function required(key, defaultValue = undefined) {
    const result = process.env[key] || defaultValue;
    if (!result) {
        throw new Error(`key ${key} is undefined`);
    }
    return result;
}

export const config = {
    jwt: {
        secretKey: required('JWT_SECRET'),
        expires: required('JWT_EXPIRES_SEC',86400),
    },
    bCrypt: {
        salt: required('BCRYPT_SALT_ROUNDS',12),
    },
    host: {
        port: required('HOST_PORT',8080),
    }
}

export default config;