const conn = require('../db')
const getMeisterNo = (studentGrade, studentClass, studentNo) => {
    const getMeisterNoQuery="SELECT `uniq_no` FROM `meister_no` WHERE `member_grade`=? AND `member_class`=? AND `member_studentNo`=?"
    const params=[studentGrade, studentClass, studentNo]
    return new Promise(resolve => {
        conn.query(getMeisterNoQuery, params, (error, rows) => {
            if(error) resolve(false)
            if(rows.length)
                resolve(rows[0])
            else
                resolve(false)
        })
    })
}

module.exports = {
    getMeisterNo:getMeisterNo,
}