let result, dbResult
const get = async (req, res) =>{
    const model = require('../../models/timetable')
    let arrTimetable=[]
    dbResult = await model.get(req.params.grade, req.params.classNo)
    if(Object.keys(dbResult).length){
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