const pool = require('../db')
const crypto = require('crypto');

const getMemberId = async (memberId) => {
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
const getMemberCode = async (memberCode) => {
    let rows
    const getMemberQuery="SELECT * FROM `members` WHERE `member_code`=?"
    try{
        [rows] = await pool.query(getMemberQuery, [memberCode])
    }catch(err){
        console.error(err)
        return null;
    }
    if(rows.length){
        rows=rows[0]
        return {
            memberType:"active",
            memberCode:memberCode,
            memberNickname:rows.member_nickname,
            memberLevel:rows.member_level,
            memberCreated:rows.member_created,
            memberEnrolled:rows.member_enrolled,
            memberGrade:rows.member_grade,
            memberClass:rows.member_class,
            memberStudentNo:rows.member_studentNo,
            memberName:rows.member_name
        }
    }else{
        if(memberCode==0){
            return {
                memberType:"deleted",
                memberCode:memberCode,
            }
        }else if(memberCode==-1){
            return {
                memberType:"anonymous",
                memberCode:memberCode,
            }
        }else{
            return {
                memberType:"none",
                memberCode:memberCode,
            }
        }
    }
}
const getMember = async (studentEnrolled, studentGrade, studentClass, studentNo, studentName) => {
    const getMemberQuery="SELECT `code`, `member_enrolled`, `member_grade`, `member_class`, `member_studentNo` FROM `valid_code` WHERE `member_enrolled`=? AND `member_grade`=? AND `member_class`=? AND `member_studentNo`=? AND `member_name`=?"
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
    const codeCheckQuery="SELECT * FROM `valid_code` WHERE `code`=?"
    let rows
    try{
        [rows] = await pool.query(codeCheckQuery, [code])
    }catch(err){
        console.error(err)
        return null;
    }
    const codeExpireQuery="UPDATE `valid_code` SET `valid`=0 WHERE `code`=?"
    try{
        await pool.query(codeExpireQuery, [code])
    }catch(err){
        console.error(err)
        return null;
    }
    const signUpQuery="INSERT INTO `members` VALUES (0, ?, ?, ?, ?, ?, now(), ?, ?, ?, ?, ?)"
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
    ]
    try{
        await pool.query(signUpQuery, [params])
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
    getMemberId:getMemberId,
    getMemberCode:getMemberCode,
    getMember:getMember,
    signUp:signUp,
    pwEdit:pwEdit
}