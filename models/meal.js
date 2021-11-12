const conn = require('../db')

const getMeal = (mealDate) => {
    const mealSearchQuery="SELECT * FROM `food` WHERE `food_date`=?"
    const params=[mealDate]
    return new Promise(resolve => {
        conn.query(mealSearchQuery, params, (error, results) => {
            if(error) resolve(false)
            resolve(results)
        })
    })
}

module.exports = {
    getMeal:getMeal,
}