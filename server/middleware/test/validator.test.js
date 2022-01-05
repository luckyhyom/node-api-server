import httpMocks from 'node-mocks-http';
import { validate } from '../validator.js';
import * as validator from 'express-validator';

jest.mock('express-validator');
describe('validator', () => {
    it('에러가 있으면 400에러와 메시지를 출력', async ()=> {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = jest.fn();

        validator.validationResult = jest.fn(() => ({
            isEmpty: () => false, array: () => [{msg:'error'}]
        }));
        await validate(req, res, next);

        expect(next).not.toBeCalled();
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData().message).toBe('error');
    });

    it('에러가 없으면 next 호출', async ()=> {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = jest.fn();

        validator.validationResult = jest.fn(() => ({ isEmpty: () => true }));
        await validate(req, res, next);

        expect(next).toBeCalled();
    });
});