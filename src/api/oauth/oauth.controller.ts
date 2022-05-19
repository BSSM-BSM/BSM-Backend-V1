import express from 'express';
const router = express.Router();
import * as service from '@src/api/oauth/oauth.service';
import { User } from '@src/api/account/User';
import * as jwt from '@src/util/jwt';
import loginCheck from '@src/util/loginCheck';


router.get('/authentication', loginCheck, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token).value);
    try {
        res.send(JSON.stringify(
            await service.authentication(
                user,
                String(req.query.clientId),
                String(req.query.redirectURI)
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/authorization', loginCheck, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token).value);
    try {
        res.send(JSON.stringify(
            await service.authorization(
                user,
                req.body.clientId,
                req.body.redirectURI
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/token', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getToken(
                req.body.clientId,
                req.body.clientSecret,
                req.body.authcode
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/resource', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getResource(
                req.body.clientId,
                req.body.clientSecret,
                req.body.token
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/client', loginCheck, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token).value);
    try {
        res.send(JSON.stringify(
            await service.createClient(
                user,
                req.body.domain,
                req.body.serviceName,
                req.body.redirectURI,
                req.body.scope
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.get('/client', loginCheck, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token).value);
    try {
        res.send(JSON.stringify(
            await service.getClientList(user)
        ));
    } catch(err) {
        next(err);
    }
})

router.get('/scopeInfo', loginCheck, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            service.getScopeInfo()
        ));
    } catch(err) {
        next(err);
    }
})

export = router;