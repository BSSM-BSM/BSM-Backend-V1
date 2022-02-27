const jwt = require('jsonwebtoken')
const crypto = require('crypto')
import express from "express"
const pool = require('./db')
const accountModel = require('./models/account')

const secretKey = process.env.SECRET_KEY

const sign = (
    payload:object, expire:string) => {
    return {
        token:jwt.sign(payload, secretKey, {
            algorithm:'HS256',
            expiresIn:expire
        })
    };
}
const login = async (
    payload:{
        isLogin:boolean,
        memberCode:number,
        memberId:number,
        memberNickname:string,
        memberLevel:number,
        grade:number,
        classNo:number,
        studentNo:number
    }, expire:string) => {
    const token = crypto.randomBytes(64).toString('hex')
    const result = {
        token: jwt.sign(payload, secretKey, {
            algorithm:'HS256',
            expiresIn:expire
        }),
        refreshToken: jwt.sign({token:token}, secretKey, {
            algorithm:'HS256',
            expiresIn:'60d'
        }),
    };
    const insertTokenQuery="INSERT INTO `tokens` VALUES(?, 1, ?, now())"
    try{
        await pool.query(insertTokenQuery, [token, payload.memberCode])
    }catch(err){
        console.error(err)
        return null;
    }
    return result;
}
const verify = (token:String) => {
    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (err:{message:String}|any) {
        if (err.message === 'jwt expired') {
            return 'EXPIRED';
        } else if (err.message === 'invalid token') {
            return 'INVALID';
        } else {
            return 'INVALID';
        }
    }
    return decoded;
}
const check = (token:String|undefined) => {
    if(token){
        const result = verify(token);
        if(result=='EXPIRED' || result=='INVALID'){
            return {
                isLogin:false,
                msg:{
                    status:4,subStatus:1
                }
            };
        }else{
            if(!result.isLogin){
                result.msg={
                    status:4,subStatus:1
                }
            }
            return result
        }
    }else{
        return {
            isLogin:false,
            msg:{
                status:4,subStatus:1
            }
        };
    }
}
const refreshToken = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    // 리프레시 토큰이 없으면 무시하고 넘어감
    if(!req.cookies.refreshToken){
        return next();
    }
    if(req.cookies.token){
        const result = verify(req.cookies.token);
        // 액세스 토큰이 사용가능하면 무시하고 넘어감
        if(!(result=='EXPIRED' || result=='INVALID')){
            return next();
        }
    }
    const result = verify(req.cookies.refreshToken);
    // 리프레시 토큰이 유효하지 않으면 무시하고 넘어감
    if(result=='INVALID'){
        res.clearCookie('refreshToken', {
            domain:'.bssm.kro.kr',
            path:'/',
        });
        return next();
    }
    // 리프레시 토큰이 만료되었으면 로그인을 요청
    if(result=='EXPIRED'){
        res.clearCookie('refreshToken', {
            domain:'.bssm.kro.kr',
            path:'/',
        });
        return res.send(JSON.stringify({status:4,subStatus:5}));
    }
    // db에서 리프레시 토큰 사용이 가능한지 확인
    let rows
    const getTokenQuery="SELECT * FROM `tokens` WHERE `token`=? AND `valid`=1";
    try{
        [rows] = await pool.query(getTokenQuery, [result.token]);
    }catch(err){
        console.error(err)
        return res.send(JSON.stringify({status:2,subStatus:0}));
    }
    if(!rows[0]){
        // 리프레시 토큰이 db에서 사용불가 되었으면 로그인을 요청
        res.clearCookie('refreshToken', {
            domain:'.bssm.kro.kr',
            path:'/',
        });
        return res.send(JSON.stringify({status:4,subStatus:5}));
    }
    rows = rows[0]
    // 유저 정보를 가져옴
    const dbResult = await accountModel.getMemberByCode(rows.member_code);
    const payload = {
        isLogin:true,
        memberCode:dbResult.member_code,
        memberId:dbResult.member_id,
        memberNickname:dbResult.member_nickname,
        memberLevel:dbResult.member_level,
        grade:dbResult.member_grade,
        classNo:dbResult.member_class,
        studentNo:dbResult.member_studentNo
    }
    // 액세스 토큰 재발행
    const token = jwt.sign(payload, secretKey, {
        algorithm:'HS256',
        expiresIn:'1h'
    })
    res.cookie('token', token, {
        domain:'.bssm.kro.kr',
        path:'/',
        httpOnly:true,
        secure:true,
        maxAge:1000*60*60// 1시간 동안 저장 1000ms*60초*60분
    });
    return res.send(JSON.stringify({status:4,subStatus:4,token:token}));
}
module.exports = {
    sign:sign,
    login:login,
    verify:verify,
    check:check,
    refreshToken:refreshToken
}