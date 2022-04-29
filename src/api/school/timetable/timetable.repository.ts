import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getTimetable = async (
    grade: number,
    classNo: number
): Promise<{
    monday: string,
    tuesday: string,
    wednesday: string,
    thursday: string,
    friday: string
} | null> => {
    const getQuery="SELECT monday, tuesday, wednesday, thursday, friday FROM timetable WHERE grade = ? AND classNo = ?"
    // SELECT 
    //     monday, 
    //     tuesday, 
    //     wednesday, 
    //     thursday, 
    //     friday 
    // FROM timetable 
    // WHERE 
    //     grade = ? AND 
    //     classNo = ?
    try {
        const [rows] = await pool.query(getQuery, [grade, classNo]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getTimetable
}