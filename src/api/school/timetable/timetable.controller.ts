import express from "express"
const service = require('./timetable.service');

const getTimetable = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    try{
        res.send(JSON.stringify(
            await service.getTimetable(req.params.grade, req.params.classNo)
        ));
    }catch(err){
        next(err);
    }
}

export {
    getTimetable
}