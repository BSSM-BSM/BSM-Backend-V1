import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getToken = async (
    token: string,
): Promise<{usercode: number, created: string} | null> => {
    const getQuery="SELECT usercode, created FROM tokens WHERE token = ? AND valid = 1";
    // SELECT 
    //     usercode, 
    //     created 
    // FROM tokens 
    // WHERE 
    //     token = ? AND 
    //     valid = 1
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

const insertToken = async (
    token: string,
    usercode: number
) => {
    const insertQuery="INSERT INTO `tokens` VALUES(?, 1, ?, now())";
    try {
        await pool.query(insertQuery, [token, usercode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getToken,
    insertToken
}