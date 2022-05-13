import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getMeal = async (mealDate: string): Promise<{
    morning: string,
    lunch: string,
    dinner: string
} | null> => {
    const getQuery="SELECT morning, lunch, dinner FROM food WHERE food_date = ?"
    // SELECT 
    //     morning, 
    //     lunch, 
    //     dinner 
    // FROM food 
    // WHERE food_date = ?

    try {
        const [rows] = await pool.query(getQuery, [mealDate]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getMeal
}