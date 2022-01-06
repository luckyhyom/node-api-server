import { TweetController } from '../tweet.js';
import { StubTweetRepository } from './stubTweetRepository.js';
import { stubGetSocketIO } from './stubSocketIO';
import httpMocks from 'node-mocks-http'

describe('tweet Controller', () => {
    let controller;
    beforeEach(() => {
        controller = new TweetController(new StubTweetRepository(), stubGetSocketIO);
    })

    describe('create', () => {
        it('생성', async () => {
            let req = httpMocks.createRequest({
                body: {
                    text: '텍스트 내용'
                },
                userId: '유저 아이디'
            });
            let res = httpMocks.createResponse();

            await controller.create(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toEqual({
                id: expect.any(Number),
                userId: '유저 아이디',
                text: '텍스트 내용',
            });
        })
    })
    describe('get', () => {
        it('저장된 트윗이 없다면?', () => {
            
        })
        it('유저 이름의 트윗 반환', async () => {
            let req = httpMocks.createRequest({
                query: {
                    username: '효민',
                },
            });
            let res = httpMocks.createResponse();

            await controller.getTweets(req, res);

            expect(res._getJSONData()).toEqual([{
                id: 1,
                text: 'one..',
                username: '효민',
                userId: '효민 아이디'
            }]);
        })
        it('전달받은 유저 이름이 없다면 모든 트윗을 반환', async () => {
            let req = httpMocks.createRequest();
            let res = httpMocks.createResponse();

            await controller.getTweets(req, res);
            
            expect(res._getJSONData()).toEqual([
                {
                    id: 1,
                    text: 'one..',
                    username: '효민',
                    userId: '효민 아이디'
                },
                {
                    id: 2,
                    text: 'two..',
                    username: '짱구',
                    userId: '짱구 아이디'
                },
                {
                    id: 3,
                    text: 'three..',
                    username: '철수',
                    userId: '철수 아이디'
                },
            ]);
        });

        describe('트윗 아이디로 찾기', () => {
            it('트윗 아이디가 존재하는 경우', async () => {
                let req = httpMocks.createRequest({
                    params: {
                        id: 1
                    }
                });
                let res = httpMocks.createResponse();

                await controller.getById(req, res);
                
                expect(res._getJSONData()).toEqual(
                    {
                        id: 1,
                        text: 'one..',
                        username: '효민',
                        userId: '효민 아이디'
                    }
                );
            });
            it('트윗 아이디가 존재하지 않는 경우', async () => {
                let req = httpMocks.createRequest({
                    params: {
                        id: 100
                    }
                });
                let res = httpMocks.createResponse();

                await controller.getById(req, res);
                
                expect(res._getJSONData().message).toBe('Tweet id(100) not found');
            });
        })
    });

    describe('update', () => {
        it('해당 아이디의 트윗 텍스트 변경', async () => {
            let req = httpMocks.createRequest({
                params: {
                    id: 1
                },
                body: {
                    text: '수정된 텍스트'
                },
                userId: '효민 아이디'
            });
            let res = httpMocks.createResponse();

            await controller.update(req, res);
            
            expect(res._getJSONData()).toEqual(
                {
                    id: 1,
                    text: '수정된 텍스트',
                    username: '효민',
                    userId: '효민 아이디'
                }
            );
        });
        it('해당 아이디의 트윗이 없을 때 404 에러 반환', async () => {
            let req = httpMocks.createRequest({
                params: {
                    id: 100
                },
                body: {
                    text: '수정된 텍스트'
                },
                userId: "효민 아이디"
            });
            let res = httpMocks.createResponse();

            await controller.update(req, res);
            
            expect(res.statusCode).toBe(404);
        });

        it('아이디가 일치하지 않을 때 403 에러', async () => {
            let req = httpMocks.createRequest({
                params: {
                    id: 1
                },
                body: {
                    text: '수정된 텍스트'
                },
                userId: "철수 아이디"
            });
            let res = httpMocks.createResponse();

            await controller.update(req, res);
            
            expect(res.statusCode).toBe(403);
            expect(res._getJSONData().message).toBe('hate you~');
        });
    })

    describe('remove', () => {
        it('트윗 삭제 성공시 204 반환', async () => {
            let req = httpMocks.createRequest({
                params: {
                    id: 1
                },
                userId: '효민 아이디'
            });
            let res = httpMocks.createResponse();

            await controller.remove(req, res);
            
            expect(res.statusCode).toBe(204);
        });
    })
})