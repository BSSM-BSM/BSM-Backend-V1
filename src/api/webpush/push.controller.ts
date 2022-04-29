import express from "express";
const router = express.Router();
import * as service from './push.service';
import * as jwt from '../../util/jwt';
import { User } from "../account/User";
import loginCheck from "../../util/loginCheck";

router.post('/meal/register',
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const user = new User(jwt.verify(req.cookies.token));
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