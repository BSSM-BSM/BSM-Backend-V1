import express from "express";
const router = express.Router();
import * as service from '@src/api/board/board.service';
import * as jwt from '@src/util/jwt';
import { User } from "@src/api/account/User";

router.get('/:boardType', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token));
    try {
        res.send(JSON.stringify(
            await service.viewBoard(
                user,
                req.params.boardType,
                Number(req.query.page),
                Number(req.query.limit),
                String(req.query.category)
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;