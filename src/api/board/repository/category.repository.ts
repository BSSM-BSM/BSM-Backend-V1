import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getCategorys = async (): Promise<[{
    board: string,
    category: string,
    name: string
}] | null> => {
    const getQuery="SELECT board, category, name FROM post_category";
    // SELECT 
    //     board, 
    //     category, 
    //     name 
    // FROM post_category
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
    getCategorys
}