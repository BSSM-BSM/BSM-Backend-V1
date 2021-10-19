let result={
    status:2,
}
let dbResult={
    bool:false,
}
let login = async (req, res) =>{
    let model = require('../../models/login')
    dbResult = await model.login(req.body.member_id, req.body.member_pw)
    if(dbResult.bool){
        req.session.isLogin=true
        req.session.memberCode=dbResult.member_code
        req.session.memberId=dbResult.member_id
        req.session.memberNickname=dbResult.member_nickname
        req.session.memberLevel=dbResult.member_level
        result={
            status:1,
            returnUrl:'/',
        }
    }else{
        result={
            status:4,
        }
    }
    res.send(JSON.stringify(result))
}
let islogin = (req, res) =>{
    if(req.session.islogin){
        result={
            status:1,
            is_login:true
        }
    }else{
        result={
            status:1,
            is_login:false
        }
    }
    res.send(model.islogin())
}

module.exports = {
    login:login,
    islogin:islogin,
}