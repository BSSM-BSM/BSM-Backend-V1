const webpush = require('web-push')
const conn = require('./db')
webpush.setVapidDetails(
    "mailto:BSM@bssm.kro.kr",
    process.env.PUSH_PUBLIC_KEY,
    process.env.PUSH_PRIVATE_KEY,
);
let tokenList = [];
const push = async (payload) => {
    tokenList = await getPushToken();
    try{
        await Promise.all(tokenList.map(t => {
            webpush.sendNotification(t, payload);
        }));
    }catch(e){
        console.error(e);
    }
}
const register = async (endpoint, auth, p256dh, memberCode) => {
    const pushRegisterQuery="INSERT INTO `push_subscribe` VALUES(?, ?, ?, ?, 1)";
    const params=[endpoint, auth, p256dh, memberCode];
    return new Promise(resolve => {
        conn.query(pushRegisterQuery, params, (error, rows) => {
            if(error) resolve(false)
            resolve(rows)
        })
    })
}

const getPushToken = async () => {
    const getPushTokenQuery="SELECT * FROM `push_subscribe` WHERE `meal`=1";
    return new Promise(resolve => {
        let result = [];
        conn.query(getPushTokenQuery, (error, rows) => {
            if(error) resolve(false)
            for(let i=0;i<rows.length;i++){
                result.push({
                    endpoint:rows[i].endpoint,
                    keys:{
                        auth:rows[i].auth,
                        p256dh:rows[i].p256dh,
                    }
                })
            }
            resolve(result)
        })
    })
}
module.exports = {
    push:push,
    register:register
}