import express from "express";
const service = require('./version.service');

const getVersion = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    try{
        res.send(JSON.stringify(
            await service.getVersion(req.params.app, req.params.os)
        ));
    }catch(err){
        next(err);
    }
}

const getVersionLegacy = async (req:express.Request, res:express.Response) =>{
    res.send(JSON.stringify({
        status:1,
        subStatus:0,
        versionCode:8,
        versionName:'1.0.0\n안드로이드 네이티브 앱은 지원이 종료되었습니다\n웹 앱을 다운 받아주세요'
    }))
}
module.exports = {
    getVersion,
    getVersionLegacy
}