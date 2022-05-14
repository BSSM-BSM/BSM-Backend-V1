import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getInfoList = async (): Promise<[{
    info: string,
    name: string,
    description: string
}] | null> => {
    const getQuery='SELECT info, name, description FROM oauth_scope_info ORDER BY idx';
    // SELECT 
    //     info, 
    //     name, 
    //     description 
    // FROM oauth_scope_info 
    // ORDER BY idx
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
    getInfoList
}