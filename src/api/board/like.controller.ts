import express from "express";
const router = express.Router();
import * as service from '@src/api/board/like.service';
import * as jwt from '@src/util/jwt';
import { User } from "@src/api/account/User";

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