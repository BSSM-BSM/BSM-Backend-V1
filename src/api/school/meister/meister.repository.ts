import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getMeisterNo = async (
    grade: number,
    classNo: number,
    studentNo: number
): Promise<number | null> => {
    const getMeisterNoQuery="SELECT uniq_no FROM student WHERE grade = ? AND class_no = ? AND student_no = ?"
    // SELECT uniq_no 
    // FROM student 
    // WHERE 
    //     grade = ? AND 
    //     class_no = ? AND 
    //     student_no = ?
    try {
        const [rows] = await pool.query(getMeisterNoQuery, [grade, classNo, studentNo]);
        if (rows.length)
            return rows[0].uniq_no;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getMeisterNo
}