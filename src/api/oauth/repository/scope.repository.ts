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

const insertScope = async (
    clientId: string,
    scopeList: string[]
) => {
    let temp: string[] = [];
    let params: string[] = [];
    // 한 번에 insert 하기 위해
    scopeList.forEach(e => {
        params.push(clientId, e);
        temp.push('(?, ?)');
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
    insertScope
}