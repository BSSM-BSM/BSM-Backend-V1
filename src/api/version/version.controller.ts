import { Expression } from "typescript"
import express from "express"

let result:{
    status:number;
    subStatus:number;
    versionCode:number;
    versionName:string;
}
const get = async (req:express.Request, res:express.Response) =>{
    switch(req.params.app){
        case 'web':
            result={
                status:1,
                subStatus:0,
                versionCode:3,
                versionName:'1.3.0'
            }
            break
        case 'app':
            switch(req.params.os){
                case 'android':
                    result={
                        status:1,
                        subStatus:0,
                        versionCode:8,
                        versionName:'1.0.0\n안드로이드 네이티브 앱은 지원이 종료되었습니다\n웹 앱을 다운 받아주세요'
                    }
                    break;
            }
            break;
    }
    res.send(result)
}
const getLegacy = async (req:express.Request, res:express.Response) =>{
    result={
        status:1,
        subStatus:0,
        versionCode:8,
        versionName:'1.0.0\n안드로이드 네이티브 앱은 지원이 종료되었습니다\n웹 앱을 다운 받아주세요'
    }
    res.send(result)
}
module.exports = {
    get:get,
    getLegacy:getLegacy
}