const conn = require('../db')

const get = (grade, classNo) => {
    const timetableSearchQuery="SELECT * FROM `timetable` WHERE `grade`=? AND `classNo`=?"
    const params=[grade, classNo]
    return new Promise(resolve => {
        conn.query(timetableSearchQuery, params, (error, rows) => {
            if(error) resolve(false)
            resolve(rows)
        })
    })
}

module.exports = {
    get:get,
}