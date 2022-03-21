import express from 'express';
import { UnAuthorizedException } from './exceptions';
const jwt = require('./jwt');

const loginCheck = (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const jwtValue = jwt.check(req.cookies.token);
    if (!jwtValue.isLogin) {
        return next(new UnAuthorizedException());
    }
    next();
}

export = loginCheck