import express from "express";
const router = express.Router();
import * as service from './version.service';

router.get('/:app/:os', (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            service.getVersion(req.params.app, req.params.os)
        ));
    } catch(err) {
        next(err);
    }
})

export = router;