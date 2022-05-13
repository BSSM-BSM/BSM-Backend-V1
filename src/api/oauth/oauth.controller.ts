import express from 'express';
const router = express.Router();
import * as service from '@src/api/oauth/oauth.service';
import { User } from '@src/api/account/User';
import * as jwt from '@src/util/jwt';


router.get('/authentication', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.authentication(
                String(req.query.clientId),
                String(req.query.redirectUri)
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/authorization', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token));
    try {
        res.send(JSON.stringify(
            await service.authorization(
                res,
                user,
                req.body.clientId,
                req.body.redirectUri
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;