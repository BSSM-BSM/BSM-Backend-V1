import webpush from 'web-push';
import * as pushRepository from '@src/api/webpush/push.repository';

const PUSH_PUBLIC_KEY = process.env?.PUSH_PUBLIC_KEY;
const PUSH_PRIVATE_KEY = process.env?.PUSH_PRIVATE_KEY;
if (!PUSH_PUBLIC_KEY || !PUSH_PRIVATE_KEY) {
    throw new Error('Push key is not defined');
}
webpush.setVapidDetails(
    "mailto:BSM@bssm.kro.kr",
    PUSH_PUBLIC_KEY,
    PUSH_PRIVATE_KEY
);

const push = async (
    payload: string,
    type: 'all' | 'meal'
) => {
    const tokenListInfo = await pushRepository.getPushToken(type);
    if (tokenListInfo === null) {
        return;
    }
    tokenListInfo.forEach(e => {
        try {
            webpush.sendNotification({
                endpoint: e.endpoint,
                keys:{
                    auth: e.auth,
                    p256dh: e.p256dh,
                }
            }, payload);
        } catch (err) {
            console.error(err);
        }
    });
}

export {
    push
}