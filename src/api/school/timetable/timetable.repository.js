const { InternalServerException } = require('../../../util/exceptions');
const pool = require('../../../util/db');

const getTimetable = async (grade, classNo) => {
    const getTimetableQuery="SELECT * FROM `timetable` WHERE `grade`=? AND `classNo`=?"
    try {
        const [rows] = await pool.query(getTimetableQuery, [grade, classNo]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

module.exports = {
    getTimetable
}