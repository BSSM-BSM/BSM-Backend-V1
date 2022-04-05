import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getPostLikeByMemberCode = async (boardType: string, postNo: number, memberCode: number) => {
    const getLikeQuery='SELECT `like` FROM post_like WHERE post_no = ? AND member_code = ? AND board = ?';
    // SELECT `like` 
    // FROM post_like 
    // WHERE 
    //     post_no = ? AND 
    //     member_code = ? AND 
    //     board = ?
    try {
        const [rows] = await pool.query(getLikeQuery, [
            postNo, 
            memberCode, 
            boardType
        ]);
        if (rows.length)
            return rows[0].like;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const insertPostLike = async (boardType: string, postNo: number, like: number, memberCode: number) => {
    const insertPostLikeQuery='INSERT INTO post_like (board, post_no, `like`, member_code) values (?, ?, ?, ?)';
    // INSERT INTO post_like (
    //     board, 
    //     post_no, 
    //     `like`, 
    //     member_code) 
    // values (
    //     ?, 
    //     ?, 
    //     ?)
    try {
        await pool.query(insertPostLikeQuery, [
            boardType, 
            postNo, 
            like, 
            memberCode
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePostLike = async (boardType: string, postNo: number, like: number, memberCode: number) => {
    const updatePostLikeQuery='UPDATE post_like SET `like`=? WHERE post_no = ? AND member_code = ? AND board = ?';
    // UPDATE ?? 
    // SET `like` = ? 
    // WHERE post_no = ? AND 
    // member_code = ? AND 
    // board = ?
    try {
        await pool.query(updatePostLikeQuery, [
            like, 
            postNo, 
            memberCode, 
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

module.exports = {
    getPostLikeByMemberCode,
    insertPostLike,
    updatePostLike
}