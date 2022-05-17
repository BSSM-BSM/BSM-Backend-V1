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

const getByUsercode = async (
    usercode: number
): Promise<[{
    clientId: string,
    info: string
}] | null> => {
    const getQuery='SELECT client_id clientId, info FROM oauth_scope WHERE usercode=?';
    // SELECT 
    //     client_id clientId, 
    //     info 
    // FROM oauth_scope 
    // WHERE usercode=?
    try {
        const [rows] = await pool.query(getQuery, [usercode]);
        if (rows.length)
            return rows;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const insertScope = async (
    clientId: string,
    scopeList: string[],
    usercode: number
) => {
    let temp: string[] = [];
    let params: (string | number)[] = [];
    // 한 번에 insert 하기 위해
    scopeList.forEach(e => {
        params.push(clientId, e, usercode);
        temp.push('(?, ?, ?)');
    });
    const insertQuery = `INSERT INTO oauth_scope VALUES ${temp.join(',')}`;
    try {
        await pool.query(insertQuery, params);
    }catch(err) {
        console.error(err)
        throw new InternalServerException();
    }
}

export {
    getById,
    getByUsercode,
    insertScope
}