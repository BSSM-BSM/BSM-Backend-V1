const pool = require('../db')

const getMeal = async mealDate => {
    let rows
    const mealSearchQuery="SELECT * FROM `food` WHERE `food_date`=?"
    try{
        [rows] = await pool.query(mealSearchQuery, [mealDate])
    }catch(err){
        console.error(err)
        return null;
    }
    return rows
}

module.exports = {
    getMeal:getMeal,
}