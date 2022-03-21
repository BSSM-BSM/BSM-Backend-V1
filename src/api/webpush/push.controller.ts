import express from "express";
import loginCheck from "../../util/loginCheck";
const router = express.Router();
const service = require('./push.service');
const jwt = require('../../util/jwt')

router.post('/meal/register',
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const jwtValue = jwt.verify(req.cookies.token);
        try {
            res.send(JSON.stringify(
                await service.register(req.body.endpoint, req.body.auth, req.body.p256dh, jwtValue.memberCode)
            ));
        } catch(err) {
            next(err);
        }
    }
)

export = router;