import express from "express";
const router = express.Router();
import * as service from '@src/api/board/comment.service';
import * as jwt from '@src/util/jwt';
import { User } from "@src/api/account/User";
import loginCheck from "@src/util/loginCheck";

router.get('/:boardType/:postNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token));
    try {
        res.send(JSON.stringify(
            await service.viewComment(
                user,
                req.params.boardType,
                Number(req.params.postNo)
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/:boardType/:postNo/:depth?/:parentIdx?',
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const user = new User(jwt.verify(req.cookies.token));
        try {
            res.send(JSON.stringify(
                await service.writeComment(
                    user,
                    req.params.boardType,
                    Number(req.params.postNo),
                    req.body.comment,
                    Number(req.params.depth),
                    req.params.parentIdx == 'null'? null: Number(req.params.parentIdx)
                )
            ));
        } catch(err) {
            next(err);
        }
    }
)

router.delete('/:boardType/:postNo/:commentIdx',
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const user = new User(jwt.verify(req.cookies.token));
        try {
            res.send(JSON.stringify(
                await service.deleteComment(
                    user,
                    req.params.boardType,
                    Number(req.params.postNo),
                    Number(req.params.commentIdx)
                )
            ));
        } catch(err) {
            next(err);
        }
    }
)

export = router;