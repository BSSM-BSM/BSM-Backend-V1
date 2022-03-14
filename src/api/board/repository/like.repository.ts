import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getPostLikeByMemberCode = async (boardType: string, postNo: number, memberCode: number) => {
    const getLikeQuery='SELECT `like` FROM ?? WHERE `post_no`=? AND `member_code`=?';
    try{
        const [rows] = await pool.query(getLikeQuery, [`${boardType}_like`, postNo, memberCode]);
        if(rows.length)
            return rows[0].like;
        else
            return null;
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

const insertPostLike = async (boardType: string, postNo: number, like: number, memberCode: number) => {
    const insertPostLikeQuery='INSERT INTO ?? (`post_no`, `like`, `member_code`) values (?, ?, ?)';
    try{
        await pool.query(insertPostLikeQuery, [`${boardType}_like`, postNo, like, memberCode]);
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePostLike = async (boardType: string, postNo: number, like: number, memberCode: number) => {
    const updatePostLikeQuery='UPDATE ?? SET `like`=? WHERE `post_no`=? AND `member_code`=?';
    try{
        await pool.query(updatePostLikeQuery, [`${boardType}_like`, like, postNo, memberCode]);
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

module.exports = {
    getPostLikeByMemberCode,
    insertPostLike,
    updatePostLike
}