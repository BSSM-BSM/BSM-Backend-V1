let result
let dbResult
const get = async (req, res) =>{
    let model = require('../../models/meal')
    let morning, lunch, dinner, arrMeal
    dbResult = await model.getMeal(req.params.mealDate)
    if(Object.keys(dbResult).length){
        dbResult=dbResult[0]
        if(dbResult.morning!=null)
            morning=dbResult.morning;
        else
            morning=null;
        if(dbResult.lunch!=null)
            lunch=dbResult.lunch;
        else
            lunch=null;
        if(dbResult.dinner!=null)
            dinner=dbResult.dinner;
        else
            dinner=null;
        arrMeal={
            morning:morning,
            lunch:lunch,
            dinner:dinner
        }
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