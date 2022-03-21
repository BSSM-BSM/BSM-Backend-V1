const { InternalServerException } = require('../../util/exceptions');
const pool = require('../../util/db');

const register = async (endpoint, auth, p256dh, memberCode) => {
    const pushRegisterQuery="INSERT INTO `push_subscribe` VALUES(?, ?, ?, ?, 1)";
    try {
        await pool.query(pushRegisterQuery, [endpoint, auth, p256dh, memberCode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
    return true;
}

const getPushToken = async (type) => {
    let getPushTokenQuery;
    switch (type) {
        case 'all':
            getPushTokenQuery="SELECT * FROM `push_subscribe`";
            break;
        case 'meal':
            getPushTokenQuery="SELECT * FROM `push_subscribe` WHERE `meal`=1";
            break;
        default:
            return null;
    }
    try {
        const [rows] = await pool.query(getPushTokenQuery);
        return rows;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

module.exports = {
    register,
    getPushToken
}