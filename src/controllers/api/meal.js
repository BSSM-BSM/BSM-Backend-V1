const model = require('../../models/meal')
const webpush = require('../../push')
const schedule = require('node-schedule')
const mealDate = {
    morning:schedule.scheduleJob('0 30 6 * * 1-5', async () =>{
        // 아침 식사 1시간전 알림
        const today = new Date();
        dbResult = await model.getMeal(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`)
        if(dbResult.length){
            dbResult=dbResult[0]
            if(dbResult.morning!=""){
                const payload = JSON.stringify({
                    title:"오늘의 아침",
                    body:dbResult.morning.replaceAll('<br/>', ' '),
                    link:"/meal"
                })
                webpush.push(payload, 'meal');
            }
        }
    }),
    lunch:schedule.scheduleJob('0 30 11 * * 1-5', async () =>{
        // 점심 식사 1시간전 알림
        const today = new Date();
        dbResult = await model.getMeal(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`)
        if(dbResult.length){
            dbResult=dbResult[0]
            if(dbResult.lunch!=""){
                const payload = JSON.stringify({
                    title:"오늘의 점심",
                    body:dbResult.lunch.replaceAll('<br/>', ' '),
                    link:"/meal"
                })
                webpush.push(payload, 'meal');
            }
        }
    }),
    dinner:schedule.scheduleJob('0 0 17 * * 1-5', async () =>{
        // 저녁 식사 1시간전 알림
        const today = new Date();
        dbResult = await model.getMeal(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`)
        if(dbResult.length){
            dbResult=dbResult[0]
            if(dbResult.dinner!=""){
                const payload = JSON.stringify({
                    title:"오늘의 저녁",
                    body:dbResult.dinner.replaceAll('<br/>', ' '),
                    link:"/meal"
                })
                webpush.push(payload, 'meal');
            }
        }
    }),
}
let result
let dbResult
const get = async (req, res) =>{
    let morning, lunch, dinner, arrMeal
    dbResult = await model.getMeal(req.params.mealDate)
    if(dbResult.length){
        dbResult=dbResult[0]
        if(dbResult.morning!="")
            morning=dbResult.morning;
        else
            morning=null;
        if(dbResult.lunch!="")
            lunch=dbResult.lunch;
        else
            lunch=null;
        if(dbResult.dinner!="")
            dinner=dbResult.dinner;
        else
            dinner=null;
        arrMeal={
            morning:morning,
            lunch:lunch,
            dinner:dinner
        }
    }else{
        arrMeal=null
    }
    result={
        status:1,
        subStatus:0,
        arrMeal:arrMeal
    }
    res.send(JSON.stringify(result))
}

module.exports = {
    get:get
}