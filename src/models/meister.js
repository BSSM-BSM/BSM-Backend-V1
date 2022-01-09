const pool = require('../db')

const getMeisterNo = async (studentGrade, studentClass, studentNo) => {
    let rows
    const getMeisterNoQuery="SELECT `uniq_no` FROM `meister_no` WHERE `member_grade`=? AND `member_class`=? AND `member_studentNo`=?"
    try{
        [rows] = await pool.query(getMeisterNoQuery, [studentGrade, studentClass, studentNo])
    }catch(err){
        console.error(err)
        return null;
    }
    if(rows.length)
        return rows[0]
    else
        return false
}

module.exports = {
    getMeisterNo:getMeisterNo,
}