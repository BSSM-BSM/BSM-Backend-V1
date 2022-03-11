import express from "express";
const service = require('./meal.service');

const get = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    try{
        res.send(JSON.stringify(
            await service.getMeal(req.params.mealDate)
        ));
    }catch(err){
        next(err);
    }
}

module.exports = {
    get
}