const jwt = require('../../../util/jwt')
const webpush = require('../../../util/push')
const register = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    await webpush.register(req.body.endpoint, req.body.auth, req.body.p256dh, jwtValue.memberCode);
    res.send(JSON.stringify({status:1,subStatus:0}));
}
module.exports = {
    register:register
}