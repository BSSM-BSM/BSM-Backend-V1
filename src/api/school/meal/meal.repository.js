const { InternalServerException } = require('../../../util/exceptions');
const pool = require('../../../util/db');

const getMeal = async mealDate => {
    const mealSearchQuery="SELECT * FROM `food` WHERE `food_date`=?"
    try{
        const [rows] = await pool.query(mealSearchQuery, [mealDate]);
        if(rows.length)
            return rows[0];
        else
            return null;
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

module.exports = {
    getMeal
}