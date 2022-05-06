import express from "express";
const router = express.Router();
import * as service from './board.service';
import * as jwt from '../../util/jwt';
import { User } from "../account/User";

router.get('/:boardType', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token));
    try {
        res.send(JSON.stringify(
            await service.viewBoard(
                user,
                req.params.boardType,
                Number(req.query.page),
                Number(req.query.limit)
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;