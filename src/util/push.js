const webpush = require('web-push');
const pool = require('./db');
webpush.setVapidDetails(
    "mailto:BSM@bssm.kro.kr",
    process.env.PUSH_PUBLIC_KEY,
    process.env.PUSH_PRIVATE_KEY,
);
const push = async (payload, type) => {
    const tokenList = await getPushToken(type);
    if(!tokenList){
        return;
    }
    try{
        Promise.all(tokenList.map(t => {
            webpush.sendNotification(t, payload);
        }));
    }catch(e){
        console.error(e);
    }
}

const getPushToken = async (type) => {
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
    push
}