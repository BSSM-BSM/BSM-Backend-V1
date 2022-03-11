import express from "express";
const service = require('./meister.service');

const getPoint = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    try{
        res.send(JSON.stringify(
            await service.getPoint(req.params.grade, req.params.classNo, req.params.studentNo, req.body.pw)
        ));
    }catch(err){
        next(err);
    }
}

const getScore = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    try{
        res.send(JSON.stringify(
            await service.getScore(req.params.grade, req.params.classNo, req.params.studentNo)
        ));
    }catch(err){
        next(err);
    }
}

module.exports = {
    getPoint,
    getScore
}