import express from "express";
const router = express.Router();
import * as service from '@src/api/webpush/push.service';
import * as jwt from '@src/util/jwt';
import { User } from "@src/api/account/User";
import loginCheck from "@src/util/loginCheck";

router.post('/meal',
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const user = new User(jwt.verify(req.cookies.token).value);
        try {
            res.send(JSON.stringify(
                await service.register(
                    req.body.endpoint,
                    req.body.auth,
                    req.body.p256dh,
                    user
                )
            ));
        } catch(err) {
            next(err);
        }
    }
)

export = router;