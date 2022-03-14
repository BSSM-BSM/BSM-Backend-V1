const { NotFoundException } = require('../../../util/exceptions');
const repository = require('./meal.repository');

const getMeal = async (mealDate) => {
    const mealInfo = await repository.getMeal(mealDate);
    if(mealInfo === null){
        throw new NotFoundException();
    }
    return {
        meal:{
            morning:mealInfo.morning==''? null: mealInfo.morning,
            lunch:mealInfo.lunch==''? null: mealInfo.lunch,
            dinner:mealInfo.dinner==''? null: mealInfo.dinner
        }
    }
}

module.exports = {
    getMeal
}