import express from "express";
const router = express.Router();
const service = require('./board.service');
const jwt = require('../../util/jwt');

router.get('/board/:boardType', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const jwtValue = await jwt.check(req.cookies.token);
    try {
        res.send(JSON.stringify(
            await service.viewBoard(
                jwtValue.isLogin? jwtValue.memberCode: null,
                req.params.boardType,
                req.query.page,
                req.query.limit
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;