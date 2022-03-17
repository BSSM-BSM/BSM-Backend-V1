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

export {
    getEmoticon,
    getEmoticonById,
    getEmoticons,
    getEmoticonsById
}