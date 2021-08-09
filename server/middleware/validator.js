import {validationResult} from 'express-validator';

export function validate(req,res,next){
    const error = validationResult(req);

    if(error.isEmpty()){
        return next();
    }

    return res.send(error.array()[0].msg);
}