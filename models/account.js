const conn = require('../db')
const crypto = require('crypto');

let result={
    bool:false,
};

const getMember = (memberId) => {
    const getMemberQuery="SELECT * FROM `members` WHERE `member_id`=?"
    const params=[memberId]
    return new Promise(resolve => {
        conn.query(getMemberQuery, params, (error, results) => {
            if(error) resolve(false)
            resolve(results[0])
        })
    })
}
const signUp = (memberId, memberPw, memberNickname, code) => {
    const codeCheckQuery="SELECT * FROM `valid_code` WHERE `code`=?"
    const params=[code]
    return new Promise(resolve => {
        //인증코드로 유저정보를 가져옴
        conn.query(codeCheckQuery, params, (error, results) => {
            if(error) resolve(error)
            const signUpQuery="INSERT INTO `members` VALUES (0, ?, ?, ?, ?, ?, now(), ?, ?, ?, ?, ?)"
            //비밀번호 해시및 salt처리
            salt=crypto.randomBytes(32).toString('hex')
            memberPw=crypto.createHash('sha3-256').update(salt+memberPw).digest('hex')
            
            //인증코드로 유저정보를 저장
            results=results[0]
            memberLevel=results.member_level
            memberEnrolled=results.member_enrolled
            memberGrade=results.member_grade
            memberClass=results.member_class
            memberStudentNo=results.member_studentNo
            memberName=results.member_name
            console.log(salt)
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
            conn.query(codeExpireQuery, code, (error, results) => {
                if(error) resolve(false)
                conn.query(signUpQuery, params, (error, results) => {
                    if(error) resolve(false)
                    resolve(true)
                })
            })
        })
    })
}

module.exports = {
    getMember:getMember,
    signUp:signUp
}