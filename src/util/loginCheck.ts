import express from 'express';
import { User } from '@src/api/account/User';
import { UnAuthorizedException } from '@src/util/exceptions';
import * as jwt from '@src/util/jwt';

const loginCheck = (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token));
    if (!user.getIsLogin()) {
        return next(new UnAuthorizedException());
    }
    next();
}

export = loginCheck