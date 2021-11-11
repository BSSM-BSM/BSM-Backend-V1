const crypto = require('crypto');

let result
let dbResult
const login = async (req, res) =>{
    let model = require('../../models/account')
    dbResult = await model.getMember(req.body.member_id)
    result={
        status:5,
        subStatus:0
    }
    if(dbResult){
        if(Object.keys(dbResult).length){
            if(dbResult.member_salt===''){
                if(dbResult.member_pw===crypto.createHash('sha3-256').update(req.body.member_pw).digest('hex')){
                    req.session.memberPwReset=dbResult.member_code
                    result={
                        status:4,
                        subStatus:2
                    }
                }
            }else{
                if(dbResult.member_pw===crypto.createHash('sha3-256').update(dbResult.member_salt+req.body.member_pw).digest('hex')){
                    req.session.isLogin=true
                    req.session.memberCode=dbResult.member_code
                    req.session.memberId=dbResult.member_id
                    req.session.memberNickname=dbResult.member_nickname
                    req.session.memberLevel=dbResult.member_level
                    result={
                        status:1,
                        subStatus:0
                    }
                }
            }
        }
    }
    res.send(JSON.stringify(result))
}
const signUp = async (req, res) =>{
    let model = require('../../models/account')
    let funcModel = require('../../models/function')
    result={
        status:2,
        subStatus:2
    }
    if(req.body.member_pw!==req.body.member_pw_check){// 비밀번호 재입력 확인
        result={
            status:5,
            subStatus:1,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(await funcModel.overlapCheck('members', 'member_id', req.body.member_id)){// 아이디 중복체크
        result={
            status:5,
            subStatus:2,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(await funcModel.overlapCheck('members', 'member_nickname', req.body.member_nickname)){// 닉네임 중복체크
        result={
            status:5,
            subStatus:3,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(!await funcModel.overlapCheck('valid_code', 'code', req.body.code)){// 인증코드 존재여부 체크
        result={
            status:3,
            subStatus:2,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(!await funcModel.validCheck('valid_code', 'code', req.body.code, 'valid', 1)){// 인증코드 유효체크
        result={
            status:4,
            subStatus:3,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(await model.signUp(req.body.member_id, req.body.member_pw, req.body.member_nickname, req.body.code)){
        result={
            status:1,
            subStatus:0
        }
    }
    res.send(JSON.stringify(result))
}
const islogin = (req, res) =>{
    if(req.session.isLogin){
        result={
            status:1,
            subStatus:0,
            is_login:true
        }
    }else{
        result={
            status:1,
            subStatus:0,
            is_login:false
        }
    }
    res.send(result)
}

module.exports = {
    login:login,
    islogin:islogin,
    signUp:signUp
}