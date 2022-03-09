const { UnAuthorizedException } = require('../../util/exceptions');
const service = require('./push.service');
const jwt = require('../../util/jwt')

const register = async (req, res, next) =>{
    const jwtValue = jwt.verify(req.cookies.token);
    try {
        if(!jwtValue.isLogin){
            throw new UnAuthorizedException();
        }
    }catch(err){
        next(err);
    }
    try {
        res.send(JSON.stringify(
            await service.register(req.body.endpoint, req.body.auth, req.body.p256dh, jwtValue.memberCode)
        ));
    }catch(err){
        next(err);
    }
}

module.exports = {
    register
}