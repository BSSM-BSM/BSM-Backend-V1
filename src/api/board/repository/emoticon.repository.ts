import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getEmoticon = async (): Promise<[{
    id: number,
    name: string,
    description: string,
    created: string,
    usercode: number
}] | null> => {
    const getQuery="SELECT id, name, description, created, usercode FROM emoticon";
    // SELECT 
    //     id, 
    //     name, 
    //     description, 
    //     created, 
    //     usercode 
    // FROM emoticon
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

const getEmoticonById = async (id: number): Promise<{
    id: number,
    name: string,
    description: string,
    created: string,
    usercode: number
} | null> => {
    const getQuery="SELECT id, name, description, created, usercode FROM emoticon WHERE id = ?";
    // SELECT 
    //     id, 
    //     name, 
    //     description, 
    //     created, 
    //     usercode 
    // FROM emoticon 
    // WHERE id = ?
    try {
        const [rows] = await pool.query(getQuery, [id]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getEmoticons = async (): Promise<[{
    id: number,
    idx: number,
    type: string
}] | null> => {
    const getQuery="SELECT id, idx, `type` FROM emoticons";
    // SELECT 
    //     id, 
    //     idx, 
    //     `type` 
    // FROM emoticons
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

const getEmoticonsById = async (id: number): Promise<[{
    id: number,
    idx: number,
    type: string
}] | null> => {
    const getQuery="SELECT id, idx, `type` FROM emoticons WHERE id = ?";
    // SELECT 
    //     id, 
    //     idx, 
    //     `type` 
    // FROM emoticons 
    // WHERE id = ?
    try {
        const [rows] = await pool.query(getQuery, [id]);
        if (rows.length)
            return rows;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getAutoIncrement = async (): Promise<number | null> => {
    const getAutoIncrementQuery=`
    SELECT AUTO_INCREMENT 
    FROM information_schema.tables 
    WHERE table_name = 'emoticon' 
    AND table_schema = DATABASE()`;
    try {
        const [rows] = await pool.query(getAutoIncrementQuery);
        if (rows.length)
            return rows[0].AUTO_INCREMENT;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const insertEmoticonInfo = async (
    id: number,
    name: string,
    description: string,
    usercode: number
) => {
    const insertInfoQuery="INSERT INTO emoticon (id, name, description, created, usercode) VALUES(?, ?, ?, now(), ?)";
    // INSERT INTO emoticon (
    //     id, 
    //     name, 
    //     description, 
    //     created, 
    //     usercode) 
    // VALUES(
    //     ?, 
    //     ?, 
    //     ?, 
    //     now(), 
    //     ?)
    try {
        await pool.query(insertInfoQuery, [id, name, description, usercode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const insertEmoticons = async (
    id: number,
    emoticonList: {
        idx: number,
        type: string
    }[]
) => {
    let temp: string[] = [];
    let params: (number | string)[] = [];
    // 한 번에 insert 하기 위해
    emoticonList.forEach(e => {
        params.push(id, e.idx, e.type);
        temp.push('(?,?,?)');
    });
    const insertEmoticonsQuery = `INSERT INTO emoticons VALUES ${temp.join(',')}`;
    try {
        await pool.query(insertEmoticonsQuery, params);
    }catch(err) {
        console.error(err)
        throw new InternalServerException();
    }
}
export {
    getEmoticon,
    getEmoticonById,
    getEmoticons,
    getEmoticonsById,
    getAutoIncrement,
    insertEmoticonInfo,
    insertEmoticons
}