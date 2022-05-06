import express from "express"
const router = express.Router();
import * as service from './timetable.service';

router.get('/:grade/:classNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getTimetable(
                Number(req.params.grade),
                Number(req.params.classNo)
            )
        ));
    } catch(err) {
        next(err);
    }
})

export = router;