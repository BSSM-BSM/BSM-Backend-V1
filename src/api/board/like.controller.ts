import express from "express";
const router = express.Router();
const service = require('./like.service');
const jwt = require('../../util/jwt');

router.post('/like/:boardType/:postNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const jwtValue = jwt.check(req.cookies.token);
    try {
        res.send(JSON.stringify(
            await service.like(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                req.params.boardType,
                req.params.postNo,
                req.body.like
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;