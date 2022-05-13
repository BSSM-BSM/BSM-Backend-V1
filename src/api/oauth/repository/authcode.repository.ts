import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../util/db');

const getByCode = async (
    authcode: string
): Promise<{usercode: number} | null> => {
    const getQuery='SELECT usercode FROM oauth_authcode WHERE authcode=?';
    // SELECT usercode 
    // FROM oauth_authcode 
    // WHERE authcode=?
    try {
        const [rows] = await pool.query(getQuery, [authcode]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const createAuthcode = async (
    authcode: string,
    usercode: number
): Promise<void> => {
    const getQuery='INSERT INTO oauth_authcode (authcode, usercode) VALUES(?, ?)';
    // INSERT INTO oauth_authcode (
    //     authcode, 
    //     usercode) 
    // VALUES(?, ?)
    try {
        await pool.query(getQuery, [authcode, usercode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getByCode,
    createAuthcode
}