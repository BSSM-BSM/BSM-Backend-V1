import { InternalServerException } from '../../util/exceptions';
const pool = require('../../util/db');

const getToken = async (
    token: string,
) => {
    const getTokenQuery="SELECT * FROM `tokens` WHERE `token`=? AND `valid`=1";
    try {
        const [rows] = await pool.query(getTokenQuery, [token]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const insertToken = async (
    token: string,
    memberCode: number
) => {
    const insertTokenQuery="INSERT INTO `tokens` VALUES(?, 1, ?, now())";
    try {
        await pool.query(insertTokenQuery, [token, memberCode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getToken,
    insertToken
}