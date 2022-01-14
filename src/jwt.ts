const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const secretKey = process.env.SECRET_KEY
const sign = (
    payload:object, expire:string) => {
    const result = {
        token: jwt.sign(payload, secretKey, {
            algorithm:'HS256',
            expiresIn:expire
        }),
        refreshToken:crypto.randomBytes(64).toString('hex')
    };
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
module.exports = {
    sign:sign,
    verify:verify,
    check:check
}