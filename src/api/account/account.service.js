const pool = require('../../util/db')
const crypto = require('crypto');

const getMemberById = async (memberId) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_id`=?"
    try{
        const [rows] = await pool.query(getMemberQuery, [memberId])
        if(rows.length)
            return rows[0]
        else
            return false
    }catch(err){
        console.error(err)
        return null;
    }
}
const getMemberByCode = async (memberCode) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_code`=?"
    try{
        const [rows] = await pool.query(getMemberQuery, [memberCode])
        if(rows.length)
            return rows[0]
        else
            return false
    }catch(err){
        console.error(err)
        return null;
    }
}
const getMember = async (studentEnrolled, studentGrade, studentClass, studentNo, studentName) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_enrolled`=? AND `member_grade`=? AND `member_class`=? AND `member_studentNo`=? AND `member_name`=?"
    try{
        const [rows] = await pool.query(getMemberQuery, [studentEnrolled, studentGrade, studentClass, studentNo, studentName])
        if(rows.length)
            return rows[0]
        else
            return false
    }catch(err){
        console.error(err)
        return null;
    }
}
const getMemberFromCode = async (studentEnrolled, studentGrade, studentClass, studentNo, studentName) => {
    const getMemberQuery="SELECT * FROM `student` WHERE `member_enrolled`=? AND `member_grade`=? AND `member_class`=? AND `member_studentNo`=? AND `member_name`=?"
    try{
        const [rows] = await pool.query(getMemberQuery, [studentEnrolled, studentGrade, studentClass, studentNo, studentName])
        if(rows.length)
            return rows[0]
        else
            return false
    }catch(err){
        console.error(err)
        return null;
    }
}
const signUp = async (memberId, memberPw, memberNickname, code) => {
    //인증코드로 유저정보를 가져옴
    const codeCheckQuery="SELECT * FROM `student` WHERE `code`=?"
    let rows
    try{
        [rows] = await pool.query(codeCheckQuery, [code])
    }catch(err){
        console.error(err)
        return null;
    }
    const codeExpireQuery="UPDATE `student` SET `code_available`=0 WHERE `code`=?"
    try{
        await pool.query(codeExpireQuery, [code])
    }catch(err){
        console.error(err)
        return null;
    }
    const signUpQuery="INSERT INTO `members` VALUES (0, ?, ?, ?, ?, ?, now(), ?, ?, ?, ?, ?, ?, ?)"
    //비밀번호 해시및 salt처리
    salt=crypto.randomBytes(32).toString('hex')
    memberPw=crypto.createHash('sha3-256').update(salt+memberPw).digest('hex')
    
    //인증코드로 유저정보를 저장
    rows=rows[0]
    memberLevel=rows.member_level
    memberEnrolled=rows.member_enrolled
    memberGrade=rows.member_grade
    memberClass=rows.member_class
    memberStudentNo=rows.member_studentNo
    memberName=rows.member_name
    email=rows.email
    uniqNo=rows.uniq_no
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
    ]
    try{
        await pool.query(signUpQuery, params)
    }catch(err){
        console.error(err)
        return null;
    }
    return true
}
const pwEdit = async (memberCode, memberPw) => {
    //비밀번호 해시및 salt처리
    salt=crypto.randomBytes(32).toString('hex')
    memberPw=crypto.createHash('sha3-256').update(salt+memberPw).digest('hex')
    const pwEditQuery="UPDATE `members` SET `member_pw`=?, `member_salt`=? WHERE `member_code`=?"
    try{
        await pool.query(pwEditQuery, [memberPw, salt, memberCode])
        return true
    }catch(err){
        console.error(err)
        return null;
    }
}

module.exports = {
    getMemberById:getMemberById,
    getMemberByCode:getMemberByCode,
    getMember:getMember,
    getMemberFromCode:getMemberFromCode,
    signUp:signUp,
    pwEdit:pwEdit
}