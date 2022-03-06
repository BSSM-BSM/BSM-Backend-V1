import express from "express"
const service = require('./timetable.service')
let result:{
    status:number;
    subStatus:number;
    arrTimetable:string[] | null;
};
let dbResult;
const get = async (req:express.Request, res:express.Response) =>{
    let arrTimetable:string[]|null=[]
    dbResult = await service.get(req.params.grade, req.params.classNo)
    if(dbResult.length){
        dbResult=dbResult[0]
        arrTimetable=[
            dbResult['monday'].split(','),
            dbResult['tuesday'].split(','),
            dbResult['wednesday'].split(','),
            dbResult['thursday'].split(','),
            dbResult['friday'].split(',')
        ]
        if(dbResult['monday']+dbResult['tuesday']+dbResult['wednesday']+dbResult['thursday']+dbResult['friday']==""){
            arrTimetable=null
        }
    }else{
        arrTimetable=null
    }
    result={
        status:1,
        subStatus:0,
        arrTimetable:arrTimetable
    }
    res.send(JSON.stringify(result))
}
module.exports = {
    get:get
}