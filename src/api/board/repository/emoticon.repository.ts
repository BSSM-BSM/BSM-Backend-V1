import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getEmoticon = async () => {
    const getEmoticonQuery="SELECT * FROM `emoticon`";
    try{
        const [rows] = await pool.query(getEmoticonQuery);
        if(rows.length)
            return rows;
        else
            return null;
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

const getEmoticonById = async (id: number) => {
    const getEmoticonQuery="SELECT * FROM `emoticon` WHERE `id`=?";
    try{
        const [rows] = await pool.query(getEmoticonQuery, [id]);
        if(rows.length)
            return rows[0];
        else
            return null;
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

const getEmoticons = async () => {
    const getEmoticonsQuery="SELECT * FROM `emoticons`";
    try{
        const [rows] = await pool.query(getEmoticonsQuery);
        if(rows.length)
            return rows;
        else
            return null;
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

const getEmoticonsById = async (id: number) => {
    const getEmoticonsQuery="SELECT * FROM `emoticons` WHERE `id`=?";
    try{
        const [rows] = await pool.query(getEmoticonsQuery, [id]);
        if(rows.length)
            return rows;
        else
            return null;
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

const getAutoIncrement = async () => {
    const getAutoIncrementQuery=`
    SELECT AUTO_INCREMENT 
    FROM information_schema.tables 
    WHERE table_name = 'emoticon' 
    AND table_schema = DATABASE()`;
    try{
        const [rows] = await pool.query(getAutoIncrementQuery);
        if(rows.length)
            return rows[0].AUTO_INCREMENT;
        else
            return null;
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

const insertEmoticonInfo = async (id: number, name: string, description: string, memberCode: number) => {
    const insertInfoQuery="INSERT INTO emoticon values(?, ?, ?, now(), ?)";
    try{
        await pool.query(insertInfoQuery, [id, name, description, memberCode]);
    }catch(err){
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
    try{
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