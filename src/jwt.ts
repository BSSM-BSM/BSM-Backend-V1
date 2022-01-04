const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const secretKey = process.env.SECRET_KEY
const options = {
    algorithm:process.env.JWT_ALG,
    expiresIn:process.env.JWT_EXP
}
const sign = async (
    payload:{
        isLogin:boolean,
        memberCode:number,
        memberId:String,
        memberNickname:String,
        memberLevel:number,
        grade:number,
        classNo:number,
        studentNo:number
    }) => {
    const result = {
        token: jwt.sign(payload, secretKey, options),
        refreshToken:crypto.randomBytes(64).toString('hex')
    };
    return result;
}
const verify = async (token:String) => {
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
const check = async (token:String|undefined) => {
    if(token){
        const result = await verify(token);
        if(result=='EXPIRED' || result=='INVALID'){
            return {
                isLogin:false,
                msg:{
                    status:4,subStatus:1
                }
            };
        }else{
            if(result.isLogin){
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
module.exports = {
    sign:sign,
    verify:verify,
    check:check
}