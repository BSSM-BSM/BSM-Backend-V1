const conn = require('../db')

const get = (grade, classNo) => {
    const timetableSearchQuery="SELECT * FROM `timetable` WHERE `grade`=? AND `classNo`=?"
    const params=[grade, classNo]
    return new Promise(resolve => {
        conn.query(timetableSearchQuery, params, (error, results) => {
            if(error) resolve(false)
            resolve(results)
        })
    })
}

module.exports = {
    get:get,
}