// 테스트 전 데이터베이스 초기화, 설정
// 테스트 후 데이터베이스 초기화

// 1. 서버를 실행시킨다.

// DB 청소는 어떻게?
import axios from "axios";
import { startServer } from "../../app.js";
import faker from 'faker';

jest.fn();
describe('Auth', () => {
    let server;
    beforeEach(async () => {
        server = await startServer();
    });

    it('', async () => {
        try {
            let a = await axios.post('http://127.0.0.1:8080/auth/signup', {
                body: {
                    username: faker.random.alphaNumeric(6),
                    password: faker.random.alphaNumeric(12),
                    name: faker.internet.userName(),
                    email: faker.internet.email(),
                    url: faker.internet.url(),
                }
            });

            console.log(a.data);
        } catch (error) {
            console.log(error);
        }
    });

    afterAll(() => {

    })
});
