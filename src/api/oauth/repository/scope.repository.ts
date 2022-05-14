import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getById = async (
    clientId: string
): Promise<[{
    info: string
}] | null> => {
    const getQuery='SELECT info FROM oauth_scope WHERE client_id=?';
    // SELECT 
    //     info 
    // FROM oauth_scope 
    // WHERE client_id=?
    try {
        const [rows] = await pool.query(getQuery, [clientId]);
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
    getById
}