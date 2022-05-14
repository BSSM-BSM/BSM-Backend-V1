import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getByCode = async (
    authcode: string,
): Promise<{
    clientId: string,
    usercode: number
} | null> => {
    const getQuery='SELECT client_id clientId, usercode FROM oauth_authcode WHERE authcode=? AND expire = 0';
    // SELECT 
    // client_id clientId, 
    // usercode 
    // FROM oauth_authcode 
    // WHERE 
    //     authcode=? AND 
    //     expire = 0
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
    clientId: string,
    usercode: number
): Promise<void> => {
    const insertQuery='INSERT INTO oauth_authcode (authcode, client_id, usercode, expire) VALUES(?, ?, ?, 0)';
    // INSERT INTO oauth_authcode (
    //     authcode, 
    //     client_id, 
    //     usercode, 
    //     expire) 
    // VALUES(?, ?, ?, 0)
    try {
        await pool.query(insertQuery, [authcode, clientId, usercode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const expireCode = async (
    authcode: string
): Promise<void> => {
    const updateQuery='UPDATE oauth_authcode SET expire=1 WHERE authcode=?';
    // UPDATE oauth_authcode 
    // SET expire=1 
    // WHERE authcode=?
    try {
        await pool.query(updateQuery, [authcode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getByCode,
    createAuthcode,
    expireCode
}