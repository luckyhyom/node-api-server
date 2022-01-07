import { TweetController } from '../tweet.js';
import httpMocks from 'node-mocks-http';
import faker from 'faker';
// faker
// toMatchObject
// repository = {} , repository.getById = () => {...} or jest..
// 위에서 repo를 주입하고 아래에서 repo를 수정한다는 점
// 지금 repo는 너무 구체적이다, 상황만 알수있으면 된다.

describe('tweet Controller', () => {
    let controller;
    let tweetsRepository;
    let socket;
    beforeEach(() => {
        tweetsRepository = {};
        socket = { emit: jest.fn() };
        controller = new TweetController(tweetsRepository, () => socket);
    })

    describe('create', () => {
        let newTweet, authorId, req, res;
        beforeEach(() => {
            newTweet = faker.random.words(3);
            authorId = faker.random.alphaNumeric(16);
            req = httpMocks.createRequest({
                body: { text: newTweet },
                userId: authorId,
            });
            res = httpMocks.createResponse();
        })
        it('생성', async () => {
            tweetsRepository.create = jest.fn((text, userId) => ({
                text,
                userId,
            }));

            await controller.create(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toMatchObject({
                text: newTweet,
                userId: authorId,
            });
            expect(tweetsRepository.create).toHaveBeenCalledWith(newTweet, authorId);
        });

        it('웹소켓 이벤트 발생', async () => {
            tweetsRepository.create = jest.fn((text, userId) => ({
                text: text,
                userId: userId,
            }));
    
            await controller.create(req, res);
    
            expect(socket.emit).toHaveBeenCalledWith('tweets', {
                text: newTweet,
                userId: authorId,
            });
        });
    })
    describe('getTweets', () => {
        it('유저 이름의 트윗 반환', async () => {
            const username = faker.internet.userName();
            const req = httpMocks.createRequest({
                query: { username },
            });
            const res = httpMocks.createResponse();
            const userTweets = [{ text: faker.random.words(3) }];
            tweetsRepository.getAllByUsername = () => userTweets;

            await controller.getTweets(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toMatchObject(userTweets);
        })

        /**
         * repository가 무엇을 반환하는지 상세하게 알 필요 없다.
         * 하지만 반환받은 값에 무언가 속성을 추가해야 할 때는 컨트롤러에서 검증해야한다.
         */
        it('전달받은 유저 이름이 없다면 모든 트윗을 반환', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const allTweets = [
                { text: faker.random.words(3) },
                { text: faker.random.words(3) }
            ]
            tweetsRepository.getAll = () => allTweets;

            await controller.getTweets(req, res);
            
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toMatchObject(allTweets);
        });

        describe('트윗 아이디로 찾기', () => {
            let tweetId, req, res;

            beforeEach(() => {
                tweetId = faker.random.alphaNumeric(16);
                req = httpMocks.createRequest({
                    params: { id: tweetId },
                });
                res = httpMocks.createResponse();
            })
            it('트윗 아이디가 존재하는 경우', async () => {
                const tweet = faker.random.words(3);
                tweetsRepository.getById = jest.fn(() => tweet);

                await controller.getById(req, res);
                
                expect(res.statusCode).toBe(200);
                expect(res._getJSONData()).toEqual(tweet);
                expect(tweetsRepository.getById).toHaveBeenCalledWith(tweetId);
            });

            it('트윗 아이디가 존재하지 않는 경우', async () => {
                tweetsRepository.getById = jest.fn(() => undefined);

                await controller.getById(req, res);
                
                expect(res.statusCode).toBe(404);
                expect(res._getJSONData().message).toBe(`Tweet id(${tweetId}) not found`);
                expect(tweetsRepository.getById).toHaveBeenCalledWith(tweetId);
                
            });
        })
    });

    describe('update', () => {
        let tweetId, updatedText, req, res, authorId;
        beforeEach(() => {
            tweetId = faker.random.alphaNumeric(16);
            updatedText = faker.random.words(3);
            authorId = faker.random.alphaNumeric(16);
            req = httpMocks.createRequest({
                params: { id: tweetId },
                body: { text: updatedText },
                userId: authorId,
            });
            res = httpMocks.createResponse();
        });
        it('해당 아이디의 트윗 텍스트 변경', async () => {
            tweetsRepository.getById = () => ({
                text: faker.random.words(3),
                userId: authorId,
            });
            tweetsRepository.update = (tweetId, newText) => ({
                text: newText,
            });

            await controller.update(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toMatchObject({
                text: updatedText,
            });
        });
        it('해당 아이디의 트윗이 없을 때 404 에러 반환', async () => {
            tweetsRepository.getById = () => undefined;
            tweetsRepository.update = jest.fn();

            await controller.update(req, res);
            
            expect(res.statusCode).toBe(404);
        });

        it('아이디가 일치하지 않을 때 403 에러', async () => {
            tweetsRepository.getById = () => ({
                userId: faker.internet.userName(),
            });
            
            await controller.update(req, res);
            
            expect(res.statusCode).toBe(403);
            expect(res._getJSONData().message).toBe('hate you~');
        });
    })

    describe('remove', () => {
        let tweetId, req, res, authorId;
        beforeEach(() => {
            tweetId = faker.random.alphaNumeric(128);
            authorId = faker.internet.userName();
            req = httpMocks.createRequest({
                params: { id: tweetId },
                userId: authorId
            });
            res = httpMocks.createResponse();
        });
        it('트윗 삭제 성공시 204 반환', async () => {
            tweetsRepository.getById = () => ({
                id: tweetId,
                userId: authorId,
            });

            // 호출 할 의존성 api를 명시한다.
            tweetsRepository.remove = jest.fn();

            await controller.remove(req, res);

            expect(res.statusCode).toBe(204);
        });
        it('userId가 일치하지 않을 경우 403 반환', async () => {
            tweetsRepository.getById = () => ({
                id: tweetId,
                userId: faker.random.alphaNumeric(16),
            });
            tweetsRepository.remove = jest.fn();

            await controller.remove(req, res);
            
            expect(res.statusCode).toBe(403);
        });

        it('트윗이 없다면 404 반환', async () => {
            tweetsRepository.getById = () => undefined;
            tweetsRepository.remove = jest.fn();

            await controller.remove(req, res);

            expect(res.statusCode).toBe(404);
            expect(tweetsRepository.remove).not.toHaveBeenCalled();
        });
    })
})