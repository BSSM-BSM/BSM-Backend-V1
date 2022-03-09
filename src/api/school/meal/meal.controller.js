const service = require('./meal.service');

const get = async (req, res, next) =>{
    try {
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