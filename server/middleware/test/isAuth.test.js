import httpMocks from 'node-mocks-http';
import faker from 'faker';
import { isAuth } from '../isAuth.js';
import jwt from 'jsonwebtoken';
import * as userRepository from '../../data/auth.js';

jest.mock('jsonwebtoken');
jest.mock('../../data/auth.js');
describe('isAuth', () => {
    it('헤더에 Authorization이 없는 경우', async () => {
        const req = httpMocks.createRequest({
            method: "GET",
            url: "/tweets",
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await isAuth(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData().message).toBe('Authentication Error');
        expect(next).not.toBeCalled();
        
    })

    it('Authorization이 Bearer가 아닌 경우', async () => {
        const req = httpMocks.createRequest({
            method: "GET",
            url: "/tweets",
            headers: {
                authorization: 'Basic'
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await isAuth(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData().message).toBe('Authentication Error');
        expect(next).not.toBeCalled();
    });

    it('헤더에 잘못된 토큰이 들어온 경우', async () => {
        const token = faker.random.alphaNumeric(128);
        const req = httpMocks.createRequest({
            method: "GET",
            url: "/tweets",
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
        
        // 토큰을 검증하는 것이 아닌, 검증에 실패했을때 예외처리에대한 테스트코드
        jwt.verify = jest.fn((token, secret, callback) => {
            callback(new Error('error'), undefined);
        });

        await isAuth(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData().message).toBe('Authentication Error');
        expect(next).not.toBeCalled();
    });
    
    it('토큰 정보에 해당하는 유저를 찾을 수 없는 경우', async () => {
        const token = faker.random.alphaNumeric(128);
        const userId = faker.random.alphaNumeric(32);
        const req = httpMocks.createRequest({
            method: "GET",
            url: "/tweets",
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        // 상황을 만든다.
        jwt.verify = jest.fn((token, secret, callback) => {
            callback(undefined, { id: userId });
        });
        userRepository.findById = jest.fn((id) => {
            return Promise.resolve(undefined);
        })

        await isAuth(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData().message).toBe('Authentication Error');
        expect(next).not.toBeCalled();
    });

    it('토큰 정보에 해당하는 유저를 찾을 수 없는 경우', async () => {
        const token = faker.random.alphaNumeric(128);
        const userId = faker.random.alphaNumeric(32);
        const req = httpMocks.createRequest({
            method: "GET",
            url: "/tweets",
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        jwt.verify = jest.fn((token, secret, callback) => {
            callback(undefined, { id: userId });
        });
        userRepository.findById = jest.fn((id) => {
            return Promise.resolve({id});
        })

        await isAuth(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(req).toMatchObject({token, userId})
        expect(next).toBeCalled();
    });

})