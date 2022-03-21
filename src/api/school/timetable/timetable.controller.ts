import express from "express"
const router = express.Router();
const service = require('./timetable.service');

router.get('/timetable/:grade/:classNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getTimetable(req.params.grade, req.params.classNo)
        ));
    } catch(err) {
        next(err);
    }
})

export = router;