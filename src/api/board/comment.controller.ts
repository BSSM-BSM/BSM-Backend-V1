import express from "express";
const router = express.Router();
const service = require('./comment.service');
const jwt = require('../../util/jwt');

router.get('/comment/:boardType/:postNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const jwtValue = await jwt.check(req.cookies.token);
    try {
        res.send(JSON.stringify(
            await service.viewComment(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                req.params.boardType,
                req.params.postNo
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/comment/:boardType/:postNo/:depth?/:parentIdx?', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const jwtValue = await jwt.check(req.cookies.token);
    try {
        res.send(JSON.stringify(
            await service.writeComment(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.memberNickname,
                req.params.boardType,
                req.params.postNo,
                req.body.comment,
                req.params.depth,
                req.params.parentIdx
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.delete('/comment/:boardType/:postNo/:commentIdx', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const jwtValue = await jwt.check(req.cookies.token);
    try {
        res.send(JSON.stringify(
            await service.deleteComment(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                req.params.boardType,
                req.params.postNo,
                req.params.commentIdx
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;