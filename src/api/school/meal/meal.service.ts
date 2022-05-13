import { NotFoundException } from '@src/util/exceptions';
import * as repository from '@src/api/school/meal/meal.repository';

const getMeal = async (mealDate: string) => {
    const mealInfo = await repository.getMeal(mealDate);
    if (mealInfo === null) {
        throw new NotFoundException();
    }
    return {
        meal:{
            morning:mealInfo.morning == ''? null: mealInfo.morning,
            lunch:mealInfo.lunch == ''? null: mealInfo.lunch,
            dinner:mealInfo.dinner == ''? null: mealInfo.dinner
        }
    }
}

export {
    getMeal
}