import httpMocks from 'node-mocks-http';
import { validate } from '../validator.js';
import { validationResult } from 'express-validator';

jest.mock('express-validator');
describe('validator', () => {
    describe('fail', () => {
        beforeAll(()=> {
            const isEmpty = jest.fn((req) => {
                return false;
            });
    
            // validationResult 이용 방법을 알아야한다.
            const array = jest.fn(() => {
                return [
                    { msg: 'error' }
                ]
            });
    
            validationResult.mockImplementation(() => {
                return {
                    isEmpty,
                    array
                };
            });
        });
        it('에러가 있으면 400에러와 메시지를 출력', async ()=> {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const next = jest.fn();
    
            await validate(req, res, next);
    
            expect(next).not.toBeCalled();
            expect(res.statusCode).toBe(400);
            expect(res._getJSONData().message).toBe('error');
        });
    });

    describe('success', () => {
        beforeAll(()=> {
            const isEmpty = jest.fn((req) => {
                return true;
            });
            validationResult.mockImplementation(() => {
                return {
                    isEmpty,
                };
            });
        });
        it('에러가 없으면 next 호출', async ()=> {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const next = jest.fn();
    
            await validate(req, res, next);
    
            expect(next).toBeCalled();
        });
    })
});