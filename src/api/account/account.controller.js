const { BadRequestException, UnAuthorizedException } = require('../../util/exceptions');
const service = require('./account.service')
const jwt = require('../../util/jwt')

const login = async (req, res, next) =>{
    try {
        res.send(JSON.stringify(
            await service.login(res, req.body.member_id, req.body.member_pw)
        ));
    }catch(err){
        next(err);
    }
}

const logout = (req, res) =>{
    res.clearCookie('token', {
        domain:'bssm.kro.kr',
        path:'/',
    });
    res.clearCookie('refreshToken', {
        domain:'bssm.kro.kr',
        path:'/',
    });
    res.clearCookie('token', {
        domain:'.bssm.kro.kr',
        path:'/',
    });
    res.clearCookie('refreshToken', {
        domain:'.bssm.kro.kr',
        path:'/',
    });
    res.send();
}

const islogin = (req, res) =>{
    if(jwt.check(req.cookies.token).isLogin){
        res.send({islogin:true});
    }else{
        res.send({islogin:false});
    }
}

const signUp = async (req, res, next) =>{
    try {
        res.send(JSON.stringify(
            await service.signUp(req.body.member_id, req.body.member_pw, req.body.member_pw_check, req.body.member_nickname, req.body.code)
        ));
    }catch(err){
        next(err);
    }
}

const view = async (req, res, next) =>{
    const jwtValue = jwt.check(req.cookies.token);
    try {
        res.send(JSON.stringify(
            await service.viewUser(jwtValue.memberCode, req.params.memberCode)
        ));
    }catch(err){
        next(err);
    }
}

const profileUpload = async (req, res, next) =>{
    try {
        res.send(JSON.stringify(
            await service.profileUpload(req.file.filename)
        ));
    }catch(err){
        next(err);
    }
}

const validCode = async (req, res, next) =>{
    try {
        res.send(JSON.stringify(
            await service.validCodeMail(req.body.student_enrolled, req.body.student_grade, req.body.student_class, req.body.student_no, req.body.student_name)
        ));
    }catch(err){
        next(err);
    }
}

const pwResetMail = async (req, res, next) => {
    try {
        res.send(JSON.stringify(
            await service.pwResetMail(req.body.member_id)
        ));
    }catch(err){
        next(err);
    }
}

const pwEdit = async (req, res, next) =>{
    const jwtValue = jwt.verify(req.cookies.token);
    try {
        if(jwtValue=='EXPIRED'){
            throw new UnAuthorizedException('Token expired');
        }
        if(!(jwtValue.pwEdit||jwtValue.memberCode)){
            BadRequestException();
        }
    }catch(err){
        next(err);
    }

    let memberCode;
    if(jwtValue.memberCode) memberCode = jwtValue.memberCode;
    if(jwtValue.pwEdit) memberCode = jwtValue.pwEdit;

    try {
        res.send(JSON.stringify(
            await service.pwEdit(res, memberCode, req.body.member_pw, req.body.member_pw_check)
        ));
    }catch(err){
        next(err);
    }
}

const token = async (req, res, next) => {
    try {
        res.send(JSON.stringify(
            await service.token(req.body.refreshToken)
        ));
    }catch(err){
        next(err);
    }
}

module.exports = {
    login:login,
    logout:logout,
    islogin:islogin,
    signUp:signUp,
    view:view,
    profileUpload:profileUpload,
    validCode:validCode,
    pwResetMail:pwResetMail,
    pwEdit:pwEdit,
    token:token
}