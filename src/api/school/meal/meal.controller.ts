import express from "express";
const router = express.Router();
const service = require('./meal.service');

router.get('/:mealDate', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getMeal(req.params.mealDate)
        ));
    } catch(err) {
        next(err);
    }
})

export = router;