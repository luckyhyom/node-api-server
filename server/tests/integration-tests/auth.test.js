import axios from "axios";
import { startServer, stopServer } from "../../app.js";
import faker from 'faker';
import { sequelize } from "../../db/database.js";
import jwt from 'jsonwebtoken';
import * as userRepository from '../../data/auth.js';

/**
 * 유의할 점) 테스트 전후로 설정과 DB 초기화
 * 1. 서버 실행
 */

describe('Auth', () => {
    let server, req, fakeUser, user;
    // Each로 매번 DB를 초기화하는 것은 성능상 비효율적이다.
    beforeAll(async () => {
        server = await startServer();
        req = axios.create({
            // axios 자체적으로 에러처리를 하지 않도록한다.(?)
            baseURL: `http://127.0.0.1:8080`,
            validateStatus: null,
        });
        fakeUser = faker.helpers.userCard();
        user = {
            name: fakeUser.name,
            username: fakeUser.username,
            email: fakeUser.email,
            url: fakeUser.website,
            password: faker.internet.password(10, true)
        };
    });

    afterAll(async () => {
        await sequelize.drop();
        await stopServer(server);
    });

    describe('POST to /auth/signup', () => {
        describe('validations', () => {
            test.each([
                ['username should be at least 5 characters', 'username', faker.random.alphaNumeric(4)],
                ['password should be at least 5 characters' , 'password', faker.random.alphaNumeric(4)],
                ['name is missing', 'name', null ],
                ['invalid email', 'email', faker.random.alphaNumeric(4)],
                ['invalid URL', 'url', faker.random.alphaNumeric(4) ],
            ])('%s', async (message, key, value) => {
                const data = {
                    ...user,
                    [key]: value
                };

                const res = await req.post('/auth/signup', data);
                
                expect(await res.status).toBe(400);
                expect(await res.data.message).toBe(message);
            });
        });
        it('returns 201 and authorization token when user details are valid', async () => {
            const res = await req.post('/auth/signup', user);

            expect(res.status).toBe(201);
            expect(res.data.token.length).toBeGreaterThan(0);
        });

        it('returns 409 when user is aleady existed', async () => {
            const res = await req.post('/auth/signup', user);

            expect(res.status).toBe(409);
            expect(res.data.message).toBe(`${user.username} already exists`);
        });
    });

    describe('POST to /auth/login', () => {
        it('존재하지 않는 유저 401 반환', async () => {
            const loginBody = { 
                username: faker.internet.userName(),
                password: faker.internet.password(),
            };

            const res = await req.post('/auth/login', loginBody);
            
            expect(res.status).toBe(401);
            expect(res.data.message).toBe('Invalid User or Password');
        });
        it('비밀번호 불일치 401 반환', async () => {
            const loginBody = {
                username: user.username,
                password: faker.internet.password(),
            }
            const res = await req.post('/auth/login', loginBody);
            
            expect(res.status).toBe(401);
            expect(res.data.message).toBe('Invalid User or Password');
        });
        it('로그인 성공시 토큰 반환', async () => {
            const loginBody = {
                username: user.username,
                password: user.password
            };

            const res = await req.post('/auth/login', loginBody);
            
            expect(res.status).toBe(200);
            expect(res.data).toMatchObject({
                token: expect.any(String),
                username: user.username
            });
        });
    });

    describe('GET to /auth/me', () => {
        let token;
        beforeAll(async () => {
            const loginBody = {
                username: user.username,
                password: user.password
            };
            const res = await req.post('auth/login', loginBody);
            token = res.data.token;
        });

        it('인증된 유저일 경우 토큰과 이름 반환', async () => {
            const req = axios.create({
                baseURL: 'http://localhost:8080',
                headers: { Authorization: `Bearer ${token}` },
            });

            const res = await req.get('/auth/me');

            expect(res.data).toMatchObject({
                token: expect.any(String),
                username: user.username
            });
        });
    })
});
