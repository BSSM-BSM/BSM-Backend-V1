const { InternalServerException } = require('../../../util/exceptions');
const pool = require('../../../util/db');

const getMeisterNo = async (grade, classNo, studentNo) => {
    const getMeisterNoQuery="SELECT `uniq_no` FROM `student` WHERE `member_grade`=? AND `member_class`=? AND `member_studentNo`=?"
    try{
        const [rows] = await pool.query(getMeisterNoQuery, [grade, classNo, studentNo]);
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
    getMeisterNo
}