import express from "express";
const router = express.Router();
const service = require('./meister.service');

router.post('/meister/point/:grade/:classNo/:studentNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getPoint(
                req.params.grade,
                req.params.classNo,
                req.params.studentNo,
                req.body.pw,
                req.body.defaultPW
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.get('/meister/score/:grade/:classNo/:studentNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getScore(
                req.params.grade,
                req.params.classNo,
                req.params.studentNo
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;