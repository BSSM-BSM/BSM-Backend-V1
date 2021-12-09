const webpush = require('../../push')
const register = async (req, res) =>{
    if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
    await webpush.register(req.body.endpoint, req.body.auth, req.body.p256dh, req.session.memberCode);
    res.send(JSON.stringify({status:1,subStatus:0}));
}
module.exports = {
    register:register
}