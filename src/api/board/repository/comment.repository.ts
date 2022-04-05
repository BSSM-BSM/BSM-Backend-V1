import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getComments = async (boardType: string, postNo: number) => {
    const getCommentsQuery='SELECT * FROM post_comment WHERE board = ? AND post_no = ? ORDER BY comment_index';
    // SELECT * 
    // FROM post_comment 
    // WHERE 
    //     board = ? AND
    //     post_no = ? 
    // ORDER BY comment_index
    try {
        const [rows] = await pool.query(getCommentsQuery, [
            boardType,
            postNo
        ]);
        if (rows.length)
            return rows;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getComment = async (boardType: string, postNo: number, idx: number) => {
    const getCommentQuery='SELECT * FROM post_comment WHERE board = ? AND post_no = ? AND comment_index = ? AND comment_deleted = 0';
    // SELECT * 
    // FROM post_comment 
    // WHERE 
    //     board = ? AND 
    //     post_no = ? AND 
    //     comment_index = ? AND 
    //     comment_deleted = 0
    try {
        const [rows] = await pool.query(getCommentQuery, [
            boardType, 
            postNo, 
            idx
        ]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const insertComment = async (
    boardType: string,
    postNo: number,
    depth: number,
    parentIdx: number,
    memberCode: number,
    memberNickname: number,
    comment: string
) => {
    const insertCommentQuery='INSERT INTO post_comment (board, post_no, comment_index, depth, parent_idx, member_code, member_nickname, comment, comment_date) SELECT ?,?, COUNT(comment_index)+1, ?, ?, ?, ?, ?, now() FROM post_comment WHERE board = ?';
    // INSERT INTO post_comment (
    //     board, 
    //     post_no, 
    //     comment_index, 
    //     depth, 
    //     parent_idx, 
    //     member_code, 
    //     member_nickname, 
    //     comment, 
    //     comment_date) 
    // SELECT 
    //     ?,
    //     ?, 
    //     COUNT(comment_index)+1, 
    //     ?, 
    //     ?, 
    //     ?, 
    //     ?, 
    //     ?, 
    //     now() 
    // FROM post_comment 
    // WHERE board = ?
    try {
        await pool.query(insertCommentQuery, [
            boardType, 
            postNo, 
            depth, 
            parentIdx, 
            memberCode, 
            memberNickname, 
            comment,
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updateParentComment = async (boardType: string, idx: number) => {
    const updateParentCommentQuery='UPDATE post_comment SET `parent` = 1 WHERE board = ? AND comment_index = ?';
    // UPDATE post_comment 
    // SET `parent` = 1 
    // WHERE 
    //     board = ? AND 
    //     comment_index = ?
    try {
        await pool.query(updateParentCommentQuery, [
            boardType, 
            idx
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const deleteComment = async (
    boardType: string,
    postNo: number,
    idx: number
) => {
    const deleteCommentQuery='UPDATE post_comment SET comment_deleted = 1 WHERE board = ? AND post_no = ? AND comment_index = ?';
    // UPDATE post_comment 
    // SET comment_deleted = 1 
    // WHERE 
    //     board = ? AND 
    //     post_no = ? AND 
    //     comment_index = ?
    try {
        await pool.query(deleteCommentQuery, [
            boardType, 
            postNo, 
            idx
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getComments,
    getComment,
    insertComment,
    updateParentComment,
    deleteComment
}