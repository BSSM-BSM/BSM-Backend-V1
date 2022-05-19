import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getByToken = async (
    token: string
): Promise<{
    clientId: string
    usercode: number
} | null> => {
    const getQuery='SELECT client_id clientId, usercode FROM oauth_token WHERE token=?';
    // SELECT 
    //     client_id clientId, 
    //     usercode 
    // FROM oauth_token 
    // WHERE token=?
    try {
        const [rows] = await pool.query(getQuery, [token]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getByUsercodeAndClientId = async (
    usercode: number,
    clientId: string
): Promise<{
    token: string
} | null> => {
    const getQuery='SELECT token FROM oauth_token WHERE usercode=? AND client_id=?';
    // SELECT 
    //     token 
    // FROM oauth_token 
    // WHERE 
    //     usercode=? AND 
    //     client_id=?
    try {
        const [rows] = await pool.query(getQuery, [usercode, clientId]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const createToken = async (
    token: string,
    clientId: string,
    usercode: number
): Promise<void> => {
    const insertQuery='INSERT INTO oauth_token (token, client_id, usercode, expire) VALUES(?, ?, ?, 0)';
    // INSERT INTO oauth_token (
    //     token, 
    //     client_id, 
    //     usercode, 
    //     expire) 
    // VALUES(?, ?, ?, 0)
    try {
        await pool.query(insertQuery, [token, clientId, usercode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const expireCode = async (
    token: string
): Promise<void> => {
    const updateQuery='UPDATE oauth_token SET expire=1 WHERE token=?';
    // UPDATE oauth_token 
    // SET expire=1 
    // WHERE token=?
    try {
        await pool.query(updateQuery, [token]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getByToken,
    getByUsercodeAndClientId,
    createToken,
    expireCode
}