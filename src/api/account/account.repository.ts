import { InternalServerException } from '../../util/exceptions';
const pool = require('../../util/db');
import crypto from 'crypto';
import { UserEntity } from './entity/user.entity';
import { StudentEntity } from './entity/student.entity';


const getById = async (
    id: string
): Promise<UserEntity | null> => {
    const getQuery="SELECT u.usercode code, u.level, u.id, u.pw, u.pw_salt 'pwSalt', u.nickname, u.created, u.uniq_no 'uniqNo', s.enrolled,s.grade, s.class_no 'classNo', s.student_no 'studentNo', s.name, s.email FROM `user` u, `student` s WHERE u.id = ? AND s.uniq_no = u.uniq_no";
    // SELECT 
    //     u.usercode code, 
    //     u.level, 
    //     u.id, 
    //     u.pw, 
    //     u.pw_salt 'pwSalt', 
    //     u.nickname, 
    //     u.created, 
    //     u.uniq_no 'uniqNo', 
    //     s.enrolled,
    //     s.grade, 
    //     s.class_no 'classNo', 
    //     s.student_no 'studentNo', 
    //     s.name, 
    //     s.email 
    // FROM `user` u, `student` s 
    // WHERE 
    //     u.id = ? AND 
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
    const getQuery="SELECT u.usercode code, u.level, u.id, u.pw, u.pw_salt 'pwSalt', u.nickname, u.created, u.uniq_no 'uniqNo', s.enrolled,s.grade, s.class_no 'classNo', s.student_no 'studentNo', s.name, s.email FROM `user` u, `student` s WHERE u.usercode = ? AND s.uniq_no = u.uniq_no";
    // SELECT 
    //     u.usercode code, 
    //     u.level, 
    //     u.id, 
    //     u.pw, 
    //     u.pw_salt 'pwSalt', 
    //     u.nickname, 
    //     u.created, 
    //     u.uniq_no 'uniqNo', 
    //     s.enrolled,
    //     s.grade, 
    //     s.class_no 'classNo', 
    //     s.student_no 'studentNo', 
    //     s.name, 
    //     s.email 
    // FROM `user` u, `student` s 
    // WHERE 
    //     u.usercode = ? AND 
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
    const getQuery="SELECT u.usercode code, u.level, u.id, u.pw, u.pw_salt 'pwSalt', u.nickname, u.created, u.uniq_no 'uniqNo', s.enrolled,s.grade, s.class_no 'classNo', s.student_no 'studentNo', s.name, s.email FROM `user` u, `student` s WHERE u.nickname = ? AND s.uniq_no = u.uniq_no";
    // SELECT 
    //     u.usercode code, 
    //     u.level, 
    //     u.id, 
    //     u.pw, 
    //     u.pw_salt 'pwSalt', 
    //     u.nickname, 
    //     u.created, 
    //     u.uniq_no 'uniqNo', 
    //     s.enrolled,
    //     s.grade, 
    //     s.class_no 'classNo', 
    //     s.student_no 'studentNo', 
    //     s.name, 
    //     s.email 
    // FROM `user` u, `student` s 
    // WHERE 
    //     u.nickname = ? AND 
    //     s.uniq_no = u.uniq_no
    try {
        const [rows] = await pool.query(getQuery, [nickname]);
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
    const getQuery="SELECT u.usercode code, u.level, u.id, u.pw, u.pw_salt 'pwSalt', u.nickname, u.created, u.uniq_no 'uniqNo', s.enrolled,s.grade, s.class_no 'classNo', s.student_no 'studentNo', s.name, s.email FROM `user` u, `student` s WHERE u.uniq_no = ? AND s.uniq_no = u.uniq_no";
    // SELECT 
    //     u.usercode code, 
    //     u.level, 
    //     u.id, 
    //     u.pw, 
    //     u.pw_salt 'pwSalt', 
    //     u.nickname, 
    //     u.created, 
    //     u.uniq_no 'uniqNo', 
    //     s.enrolled,
    //     s.grade, 
    //     s.class_no 'classNo', 
    //     s.student_no 'studentNo', 
    //     s.name, 
    //     s.email 
    // FROM `user` u, `student` s 
    // WHERE 
    //     u.uniq_no = ? AND 
    //     s.uniq_no = u.uniq_no
    try {
        const [rows] = await pool.query(getQuery, [uniqNo]);
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
    const getQuery="SELECT u.usercode code, u.level, u.id, u.pw, u.pw_salt 'pwSalt', u.nickname, u.created, u.uniq_no 'uniqNo', s.enrolled,s.grade, s.class_no 'classNo', s.student_no 'studentNo', s.name, s.email FROM `user` u, `student` s WHERE s.uniq_no = u.uniq_no AND s.enrolled = ? AND s.grade = ? AND s.class_no = ? AND s.student_no = ? AND s.name = ?";
    // SELECT 
    //     u.usercode code, 
    //     u.level, 
    //     u.id, 
    //     u.pw, 
    //     u.pw_salt 'pwSalt', 
    //     u.nickname, 
    //     u.created, 
    //     u.uniq_no 'uniqNo', 
    //     s.enrolled,
    //     s.grade, 
    //     s.class_no 'classNo', 
    //     s.student_no 'studentNo', 
    //     s.name, 
    //     s.email 
    // FROM `user` u, `student` s 
    // WHERE 
    //     s.uniq_no = u.uniq_no AND 
    //     s.enrolled = ? AND 
    //     s.grade = ? AND 
    //     s.class_no = ? AND 
    //     s.student_no = ? AND 
    //     s.name = ?
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
    authCode: string
): Promise<StudentEntity | null> => {
    const getQuery="SELECT code_available codeAvailable, auth_code authCode, level, enrolled, grade, class_no classNo, student_no studentNo, email, uniq_no uniqNo FROM `student` WHERE auth_code = ?"
    // SELECT 
    //     code_available codeAvailable, 
    //     auth_code authCode, 
    //     level, 
    //     enrolled, 
    //     grade, 
    //     class_no classNo, 
    //     student_no studentNo, 
    //     email, 
    //     uniq_no uniqNo 
    // FROM `student` 
    // WHERE auth_code = ?
    try {
        const [rows] = await pool.query(getQuery, [authCode]);
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
    enrolled: number,
    grade: number,
    classNo: number,
    studentNo: number,
    name: string
): Promise<StudentEntity | null> => {
    const getQuery="SELECT code_available codeAvailable, auth_code authCode, level, enrolled, grade, class_no classNo, student_no studentNo, email, uniq_no uniqNo FROM `student` WHERE enrolled = ? AND grade = ? AND class_no = ? AND student_no = ? AND name = ?"
    // SELECT 
    //     code_available codeAvailable, 
    //     auth_code authCode, 
    //     level, 
    //     enrolled, 
    //     grade, 
    //     class_no classNo, 
    //     student_no studentNo, 
    //     email, 
    //     uniq_no uniqNo 
    // FROM `student` 
    // WHERE 
    //     enrolled = ? AND 
    //     grade = ? AND 
    //     class_no = ? AND 
    //     student_no = ? AND 
    //     name = ?
    try {
        const [rows] = await pool.query(getQuery, [
            enrolled,
            grade,
            classNo,
            studentNo,
            name
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

const signUp = async (
    level: number,
    id: string,
    pw: string,
    nickname: string,
    uniqNo: string
) => {
    const signUpQuery="INSERT INTO `user` (level, id, pw, pw_salt, nickname, created, uniq_no) VALUES(?, ?, ?, ?, ?, now(), ?)"
    // INSERT INTO `user` (
    //     level, 
    //     id, 
    //     pw, 
    //     pw_salt, 
    //     nickname, 
    //     created, 
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

const updateCodeAvailable = (
    code: string,
    flag: boolean
) => {
    const updateCodeAvailableQuery="UPDATE `student` SET `code_available`=? WHERE `auth_code`=?";
    try {
        pool.query(updateCodeAvailableQuery, [flag, code]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePWByCode = async (
    usercode: number, 
    pw: string
) => {
    //비밀번호 해시및 salt처리
    const salt=crypto.randomBytes(32).toString('hex');
    pw = crypto.createHash('sha3-256').update(salt+pw).digest('hex');
    const pwEditQuery="UPDATE `user` SET `pw`=?, `pw_salt`=? WHERE `usercode`=?";
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
    getStudentByCode,
    getStudent,
    signUp,
    updateCodeAvailable,
    updatePWByCode,
}