const conn = require('../db')
const crypto = require('crypto');

const getMemberId = (memberId) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_id`=?"
    const params=[memberId]
    return new Promise(resolve => {
        conn.query(getMemberQuery, params, (error, rows) => {
            if(error) resolve(false)
            if(rows.length)
                resolve(rows[0])
            else
                resolve(false)
        })
    })
}
const getMemberCode = (memberCode) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_code`=?"
    const params=[memberCode]
    return new Promise(resolve => {
        conn.query(getMemberQuery, params, (error, rows) => {
            if(error) resolve(false)
            if(rows.length)
                resolve(rows[0])
            else
                resolve(false)
        })
    })
}
const getMember = (studentEnrolled, studentGrade, studentClass, studentNo, studentName) => {
    const getMemberQuery="SELECT `code`, `member_enrolled`, `member_grade`, `member_class`, `member_studentNo` FROM `valid_code` WHERE `member_enrolled`=? AND `member_grade`=? AND `member_class`=? AND `member_studentNo`=? AND `member_name`=?"
    const params=[studentEnrolled, studentGrade, studentClass, studentNo, studentName]
    return new Promise(resolve => {
        conn.query(getMemberQuery, params, (error, rows) => {
            if(error) resolve(false)
            if(rows.length)
                resolve(rows[0])
            else
                resolve(false)
        })
    })
}
const signUp = (memberId, memberPw, memberNickname, code) => {
    const codeCheckQuery="SELECT * FROM `valid_code` WHERE `code`=?"
    const params=[code]
    return new Promise(resolve => {
        //인증코드로 유저정보를 가져옴
        conn.query(codeCheckQuery, params, (error, rows) => {
            if(error) resolve(error)
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
            const codeExpireQuery="UPDATE `valid_code` SET `valid`=0 WHERE `code`=?"
            conn.query(codeExpireQuery, code, (error, rows) => {
                if(error) resolve(false)
                conn.query(signUpQuery, params, (error, rows) => {
                    if(error) resolve(false)
                    resolve(true)
                })
            })
        })
    })
}

module.exports = {
    getMemberId:getMemberId,
    getMemberCode:getMemberCode,
    getMember:getMember,
    signUp:signUp
}