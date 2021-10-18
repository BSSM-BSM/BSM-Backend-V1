
var result={
    status:2,
}
var dbResult={
    bool:false,
}

let login = async (req, res) =>{
    let model = require('../../models/login')
    dbResult = await model.login(req.body.member_id, req.body.member_pw)
    if(dbResult.bool){
        req.session.islogin=true
        req.session.member_code=dbResult.member_code
        req.session.member_id=dbResult.member_id
        req.session.member_nickname=dbResult.member_nickname
        req.session.member_level=dbResult.member_level
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