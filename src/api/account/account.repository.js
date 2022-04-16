const { InternalServerException } = require('../../util/exceptions');
const pool = require('../../util/db');
const crypto = require('crypto');

const getById = async (userId) => {
    const getQuery="SELECT u.user_code 'usercode', u.user_level 'level', u.user_id 'id', u.user_pw 'pw', u.user_pw_salt 'pwSalt', u.user_nickname 'nickname', u.user_created 'created', u.uniq_no 'uniqNo', s.member_grade 'grade', s.member_class 'classNo', s.member_studentNo 'studentNo', s.member_name 'name' FROM `user` u, `student` s WHERE u.user_id = ? AND s.uniq_no = u.uniq_no";
    // SELECT 
    //     u.user_code 'usercode', 
    //     u.user_level 'level', 
    //     u.user_id 'id', 
    //     u.user_pw 'pw', 
    //     u.user_pw_salt 'pwSalt', 
    //     u.user_nickname 'nickname', 
    //     u.user_created 'created', 
    //     u.uniq_no 'uniqNo', 
    //     s.student_grade 'grade', 
    //     s.student_class 'classNo', 
    //     s.student_no 'studentNo', 
    //     s.student_name 'name' 
    // FROM `user` u, `student` s 
    // WHERE 
    //     u.user_id = ? AND 
    //     s.uniq_no = u.uniq_no
    try {
        const [rows] = await pool.query(getQuery, [userId]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getMemberByCode = async (memberCode) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_code`=?";
    try {
        const [rows] = await pool.query(getMemberQuery, [memberCode]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getMemberByNickname = async (memberNickname) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_nickname`=?";
    try {
        const [rows] = await pool.query(getMemberQuery, [memberNickname]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getMemberByUniqNo = async (uniqNo) => {
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

const getMember = async (studentEnrolled, studentGrade, studentClass, studentNo, studentName) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_enrolled`=? AND `member_grade`=? AND `member_class`=? AND `member_studentNo`=? AND `member_name`=?";
    try {
        const [rows] = await pool.query(getMemberQuery, [studentEnrolled, studentGrade, studentClass, studentNo, studentName]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getMemberFromCode = async (studentEnrolled, studentGrade, studentClass, studentNo, studentName) => {
    const getMemberQuery="SELECT * FROM `student` WHERE `member_enrolled`=? AND `member_grade`=? AND `member_class`=? AND `member_studentNo`=? AND `member_name`=?";
    try {
        const [rows] = await pool.query(getMemberQuery, [studentEnrolled, studentGrade, studentClass, studentNo, studentName]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getStudentInfoByCode = async (code) => {
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

const updateCodeAvailable = (code, flag) => {
    const updateCodeAvailableQuery="UPDATE `student` SET `code_available`=? WHERE `code`=?";
    try {
        pool.query(updateCodeAvailableQuery, [flag, code]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const signUp = async (
    memberLevel,
    memberId,
    memberPw,
    memberNickname,
    memberEnrolled,
    memberGrade,
    memberClass,
    memberStudentNo,
    memberName,
    email,
    uniqNo
) => {
    const signUpQuery="INSERT INTO `members` VALUES (0, ?, ?, ?, ?, ?, now(), ?, ?, ?, ?, ?, ?, ?)"
    //비밀번호 해시및 salt처리
    salt=crypto.randomBytes(32).toString('hex')
    memberPw=crypto.createHash('sha3-256').update(salt+memberPw).digest('hex')
    const params=[
        memberLevel,
        memberId,
        memberPw,
        salt,
        memberNickname,
        memberEnrolled,
        memberGrade,
        memberClass,
        memberStudentNo,
        memberName,
        email,
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

const updatePWByCode = async (memberCode, memberPw) => {
    //비밀번호 해시및 salt처리
    salt=crypto.randomBytes(32).toString('hex');
    memberPw=crypto.createHash('sha3-256').update(salt+memberPw).digest('hex');
    const pwEditQuery="UPDATE `members` SET `member_pw`=?, `member_salt`=? WHERE `member_code`=?";
    try {
        await pool.query(pwEditQuery, [memberPw, salt, memberCode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
    return salt;
}

module.exports = {
    getById,
    getMemberByCode,
    getMemberByNickname,
    getMemberByUniqNo,
    getMember,
    getMemberFromCode,
    signUp,
    getStudentInfoByCode,
    updateCodeAvailable,
    updatePWByCode,
}