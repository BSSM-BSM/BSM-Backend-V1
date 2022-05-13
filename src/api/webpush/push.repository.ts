import { BadRequestException, InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const register = async (
    endpoint: string,
    auth: string,
    p256dh: string,
    usercode: number
): Promise<void> => {
    const pushRegisterQuery="INSERT INTO `push_subscribe` VALUES(?, ?, ?, ?, 1)";
    try {
        await pool.query(pushRegisterQuery, [endpoint, auth, p256dh, usercode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getPushToken = async (
    type: 'all' | 'meal'
): Promise<[{
    endpoint: string,
    auth: string,
    p256dh: string,
    usercode: number
}] | null> => {
    let getQuery;
    switch (type) {
        case 'all':
            getQuery="SELECT endpoint, auth, p256dh, usercode FROM push_subscribe";
            // SELECT 
            //     endpoint, 
            //     auth, 
            //     p256dh, 
            //     usercode 
            // FROM push_subscribe
            break;
        case 'meal':
            getQuery="SELECT endpoint, auth, p256dh, usercode FROM push_subscribe WHERE meal=1";
            break;
        default:
            console.error(`Get push token error, type: ${type}`);
            throw new BadRequestException();
    }
    try {
        const [rows] = await pool.query(getQuery);
        if (rows.length)
            return rows;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    register,
    getPushToken
}