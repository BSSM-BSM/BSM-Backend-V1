const pool = require('../db')

const get = async (grade, classNo) => {
    let rows
    const timetableSearchQuery="SELECT * FROM `timetable` WHERE `grade`=? AND `classNo`=?"
    try{
        [rows] = await pool.query(timetableSearchQuery, [grade, classNo])
    }catch(err){
        console.error(err)
        return null;
    }
    return rows
}

module.exports = {
    get:get,
}