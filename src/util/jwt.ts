import express from "express";
import { UnAuthorizedException } from "./exceptions";
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const accountRepository = require('../api/account/account.repository');
const tokenRepository = require('../api/account/token.repository');

const secretKey = process.env.SECRET_KEY;

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
    }, expire:string
) => {
    const token = crypto.randomBytes(64).toString('hex');
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
    await tokenRepository.insertToken(token, payload.memberCode);
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
                isLogin:false
            };
        }else{
            if(!result.isLogin){
                return {
                    isLogin:false
                };
            }
            return result;
        }
    }else{
        return {
            isLogin:false
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
        res.clearCookie('refreshToken', {
            domain:'bssm.kro.kr',
            path:'/',
        });
        res.clearCookie('token', {
            domain:'.bssm.kro.kr',
            path:'/',
        });
        res.clearCookie('token', {
            domain:'bssm.kro.kr',
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
        res.clearCookie('refreshToken', {
            domain:'bssm.kro.kr',
            path:'/',
        });
        res.clearCookie('token', {
            domain:'.bssm.kro.kr',
            path:'/',
        });
        res.clearCookie('token', {
            domain:'bssm.kro.kr',
            path:'/',
        });
        throw new UnAuthorizedException('Need to relogin');
    }

    // db에서 리프레시 토큰 사용이 가능한지 확인
    const tokenInfo = await tokenRepository.getToken(result.token);
    // 리프레시 토큰이 db에서 사용불가 되었으면 로그인을 요청
    if(tokenInfo === null){
        res.clearCookie('refreshToken', {
            domain:'.bssm.kro.kr',
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
        res.clearCookie('token', {
            domain:'bssm.kro.kr',
            path:'/',
        });
        throw new UnAuthorizedException('Need to relogin');
    }

    // 유저 정보를 가져옴
    const memberInfo = await accountRepository.getMemberByCode(tokenInfo.member_code);
    if(memberInfo === null){
        res.clearCookie('refreshToken', {
            domain:'.bssm.kro.kr',
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
        res.clearCookie('token', {
            domain:'bssm.kro.kr',
            path:'/',
        });
        throw new UnAuthorizedException('Need to relogin');
    }

    const payload = {
        isLogin:true,
        memberCode:memberInfo.member_code,
        memberId:memberInfo.member_id,
        memberNickname:memberInfo.member_nickname,
        memberLevel:memberInfo.member_level,
        grade:memberInfo.member_grade,
        classNo:memberInfo.member_class,
        studentNo:memberInfo.member_studentNo
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
    return res.status(401).send(JSON.stringify({
        statusCode:401,
        message:'token updated',
        token
    }));
}

export {
    sign,
    login,
    verify,
    check,
    refreshToken
}