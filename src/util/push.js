const webpush = require('web-push')
const pool = require('./db')
webpush.setVapidDetails(
    "mailto:BSM@bssm.kro.kr",
    process.env.PUSH_PUBLIC_KEY,
    process.env.PUSH_PRIVATE_KEY,
);
const push = async (payload, to) => {
    const tokenList = await getPushToken(to);
    if(tokenList){
        try{
            Promise.all(tokenList.map(t => {
                webpush.sendNotification(t, payload);
            }));
        }catch(e){
            console.error(e);
        }
    }
}
const register = async (endpoint, auth, p256dh, memberCode) => {
    const pushRegisterQuery="INSERT INTO `push_subscribe` VALUES(?, ?, ?, ?, 1)";
    try{
        await pool.query(pushRegisterQuery, [endpoint, auth, p256dh, memberCode])
    }catch(err){
        console.error(err)
        return null;
    }
    return true
}

const getPushToken = async (to) => {
    let rows, getPushTokenQuery;
    switch(to){
        case 'all':
            getPushTokenQuery="SELECT * FROM `push_subscribe`";
            break;
        case 'meal':
            getPushTokenQuery="SELECT * FROM `push_subscribe` WHERE `meal`=1 AND `member_code`=1";
            break;
        default:
            return null;
    }
    try{
        [rows] = await pool.query(getPushTokenQuery)
    }catch(err){
        console.error(err)
        return null;
    }
    let result = [];
    rows.forEach(row => {
        result.push({
            endpoint:row.endpoint,
            keys:{
                auth:row.auth,
                p256dh:row.p256dh,
            }
        })
    });
    return result;
}
module.exports = {
    push:push,
    register:register
}