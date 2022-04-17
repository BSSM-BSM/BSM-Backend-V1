import { InternalServerException } from '../../util/exceptions';
const pool = require('../../util/db');
import crypto from 'crypto';
import { UserEntity } from './entity/user.entity';
import { StudentEntity } from './entity/student.entity';


const getById = async (
    id: string
): Promise<UserEntity | null> => {
    const getQuery="SELECT u.user_code 'code', u.user_level 'level', u.user_id 'id', u.user_pw 'pw', u.user_pw_salt 'pwSalt', u.user_nickname 'nickname', u.user_created 'created', u.uniq_no 'uniqNo', s.student_enrolled 'enrolled', s.member_grade 'grade', s.member_class 'classNo', s.member_studentNo 'studentNo', s.member_name 'name' FROM `user` u, `student` s WHERE u.user_id = ? AND s.uniq_no = u.uniq_no";
    // SELECT 
    //     u.user_code 'code', 
    //     u.user_level 'level', 
    //     u.user_id 'id', 
    //     u.user_pw 'pw', 
    //     u.user_pw_salt 'pwSalt', 
    //     u.user_nickname 'nickname', 
    //     u.user_created 'created', 
    //     u.uniq_no 'uniqNo', 
    //     s.student_enrolled 'enrolled',
    //     s.student_grade 'grade', 
    //     s.student_class 'classNo', 
    //     s.student_no 'studentNo', 
    //     s.student_name 'name' 
    // FROM `user` u, `student` s 
    // WHERE 
    //     u.user_id = ? AND 
    //     s.uniq_no = u.uniq_no
    try {
        const [rows] = await pool.query(getQuery, [id]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getByUsercode = async (
    code: number
): Promise<UserEntity | null> => {
    const getQuery="SELECT u.user_code 'code', u.user_level 'level', u.user_id 'id', u.user_pw 'pw', u.user_pw_salt 'pwSalt', u.user_nickname 'nickname', u.user_created 'created', u.uniq_no 'uniqNo', s.student_enrolled 'enrolled', s.member_grade 'grade', s.member_class 'classNo', s.member_studentNo 'studentNo', s.member_name 'name' FROM `user` u, `student` s WHERE u.user_id = ? AND s.uniq_no = u.uniq_no";
    // SELECT 
    //     u.user_code 'code', 
    //     u.user_level 'level', 
    //     u.user_id 'id', 
    //     u.user_pw 'pw', 
    //     u.user_pw_salt 'pwSalt', 
    //     u.user_nickname 'nickname', 
    //     u.user_created 'created', 
    //     u.uniq_no 'uniqNo', 
    //     s.student_enrolled 'enrolled',
    //     s.student_grade 'grade', 
    //     s.student_class 'classNo', 
    //     s.student_no 'studentNo', 
    //     s.student_name 'name' 
    // FROM `user` u, `student` s 
    // WHERE 
    //     u.user_co = ? AND 
    //     s.uniq_no = u.uniq_no
    try {
        const [rows] = await pool.query(getQuery, [code]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getByNickname = async (
    nickname: string
): Promise<UserEntity | null> => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_nickname`=?";
    try {
        const [rows] = await pool.query(getMemberQuery, [nickname]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getByUniqNo = async (
    uniqNo: string
): Promise<UserEntity | null> => {
    const getMemberQuery="SELECT * FROM `members` WHERE `uniq_no`=?";
    try {
        const [rows] = await pool.query(getMemberQuery, [uniqNo]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getUser = async (
    studentEnrolled: number, 
    studentGrade: number, 
    studentClass: number, 
    studentNo: number, 
    studentName: string
): Promise<UserEntity | null> => {
    const getQuery="SELECT * FROM `user` WHERE uniq_no IN (SELECT uniq_no FROM student WHERE student_enrolled = ? AND student_grade = ? AND student_class = ? AND student_no = ? AND student_name = ?)";
    // SELECT * 
    // FROM `user` 
    // WHERE uniq_no IN (
    //     SELECT uniq_no 
    //     FROM student 
    //     WHERE 
    //         student_enrolled = ? AND 
    //         student_grade = ? AND 
    //         student_class = ? AND 
    //         student_no = ? AND 
    //         student_name = ?)
    try {
        const [rows] = await pool.query(getQuery, [
            studentEnrolled, 
            studentGrade, 
            studentClass, 
            studentNo, 
            studentName]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getStudentByCode = async (
    code: string
): Promise<StudentEntity | null> => {
    const getCodeQuery="SELECT * FROM `student` WHERE `code`=?"
    try {
        const [rows] = await pool.query(getCodeQuery, [code]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getStudent = async (
    studentEnrolled: number,
    studentGrade: number,
    studentClass: number,
    studentNo: number,
    studentName: string
): Promise<StudentEntity | null> => {
    const getCodeQuery="SELECT * FROM `student` WHERE `member_enrolled`=? AND `member_grade`=? AND `member_class`=? AND `member_studentNo`=? AND `member_name`=?"
    try {
        const [rows] = await pool.query(getCodeQuery, [
            studentEnrolled,
            studentGrade,
            studentClass,
            studentNo,
            studentName
        ]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}
const updateCodeAvailable = (
    code: string,
    flag: boolean
) => {
    const updateCodeAvailableQuery="UPDATE `student` SET `code_available`=? WHERE `code`=?";
    try {
        pool.query(updateCodeAvailableQuery, [flag, code]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const signUp = async (
    level: number,
    id: string,
    pw: string,
    nickname: string,
    uniqNo: string
) => {
    const signUpQuery="INSERT INTO `user` (user_code, user_level, user_id, user_pw, user_pw_salt, user_nickname, user_created, uniq_no) VALUES(1, 0, ?, ?, ?, ?, now(), ?)"
    // INSERT INTO `user` (
    //     user_level, 
    //     user_id, 
    //     user_pw, 
    //     user_pw_salt, 
    //     user_nickname, 
    //     user_created, 
    //     uniq_no) 
    // VALUES(
    //     ?, 
    //     ?, 
    //     ?, 
    //     ?, 
    //     ?, 
    //     now(), 
    //     ?)

    //비밀번호 해시및 salt처리
    const salt = crypto.randomBytes(32).toString('hex')
    pw = crypto.createHash('sha3-256').update(salt+pw).digest('hex')
    const params=[
        level,
        id,
        pw,
        salt,
        nickname,
        uniqNo
    ];
    try {
        await pool.query(signUpQuery, params);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
    return true;
}

const updatePWByCode = async (
    usercode: number, 
    pw: string
) => {
    //비밀번호 해시및 salt처리
    const salt=crypto.randomBytes(32).toString('hex');
    pw = crypto.createHash('sha3-256').update(salt+pw).digest('hex');
    const pwEditQuery="UPDATE `user` SET `user_pw`=?, `user_pw_salt`=? WHERE `user_code`=?";
    try {
        await pool.query(pwEditQuery, [pw, salt, usercode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
    return salt;
}

export {
    getById,
    getByUsercode,
    getByNickname,
    getByUniqNo,
    getUser,
    signUp,
    getStudentByCode,
    getStudent,
    updateCodeAvailable,
    updatePWByCode,
}