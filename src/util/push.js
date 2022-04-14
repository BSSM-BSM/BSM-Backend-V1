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
    tokenListInfo.map(e => {
        try {
            webpush.sendNotification({
                endpoint:e.endpoint,
                keys:{
                    auth:e.auth,
                    p256dh:e.p256dh,
                }
            }, payload);
        } catch (err) {
            console.error(err);
        }
    });
}

module.exports = {
    push
}