const webpush = require('web-push');
const pushRepository = require('../api/webpush/push.repository');
webpush.setVapidDetails(
    "mailto:BSM@bssm.kro.kr",
    process.env.PUSH_PUBLIC_KEY,
    process.env.PUSH_PRIVATE_KEY,
);
const push = async (payload, type) => {
    const tokenListInfo = await pushRepository.getPushToken(type);
    if (!tokenListInfo) {
        return;
    }
    try {
        Promise.all(tokenListInfo.map(e => {
            webpush.sendNotification({
                endpoint:e.endpoint,
                keys:{
                    auth:e.auth,
                    p256dh:e.p256dh,
                }
            }, payload);
        }));
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    push
}