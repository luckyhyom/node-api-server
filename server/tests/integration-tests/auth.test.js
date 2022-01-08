import axios from "axios";
import { startServer, stopServer } from "../../app.js";
import faker from 'faker';
import { sequelize } from "../../db/database.js";
import { expectCt } from "helmet";

/**
 * 유의할 점) 테스트 전후로 설정과 DB 초기화
 * 1. 서버 실행
 */

describe('Auth', () => {
    let server;
    let req;
    // Each로 매번 DB를 초기화하는 것은 성능상 비효율적이다.
    beforeAll(async () => {
        server = await startServer();
        req = axios.create({
            // axios 자체적으로 에러처리를 하지 않도록한다.(?)
            baseURL: `http://127.0.0.1:8080`,
            validateStatus: null,
        });
    });

    afterAll(async () => {
        await sequelize.drop();
        await stopServer(server);
    });

    describe('POST to /auth/signup', () => {
        let fakeUser;
        let user;
        beforeAll(() => {
            fakeUser = faker.helpers.userCard();
            user = {
                name: fakeUser.name,
                username: fakeUser.username,
                email: fakeUser.email,
                url: fakeUser.website,
                password: faker.internet.password(10, true)
            };
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


});
