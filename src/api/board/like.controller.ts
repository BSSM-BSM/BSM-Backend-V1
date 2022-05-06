import express from "express";
const router = express.Router();
import * as service from './like.service';
import * as jwt from '../../util/jwt';
import { User } from "../account/User";

router.post('/:boardType/:postNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token));
    try {
        res.send(JSON.stringify(
            await service.like(
                user,
                req.params.boardType,
                Number(req.params.postNo),
                Number(req.body.like)
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;