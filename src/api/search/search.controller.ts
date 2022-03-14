import express from "express";
const service = require('./search.service');

const get = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    try{
        res.send(JSON.stringify(
            await service.getBoard(req.params.searchType, req.params.searchStr)
        ));
    }catch(err){
        next(err);
    }
}

export {
    get
}