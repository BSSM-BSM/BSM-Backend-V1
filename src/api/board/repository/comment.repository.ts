import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');
import { CommentEntity } from '@src/api/board/entity/comment.entity';

const getComments = async (
    boardType: string,
    postNo: number
): Promise<CommentEntity[] | null> => {
    const getQuery="SELECT p.idx, p.usercode, u.nickname, p.`depth`, p.parent, p.parent_idx, p.is_delete, p.is_secret, p.comment, p.`date` FROM post_comment p, user u WHERE p.board = ? AND p.post_no = ? AND p.usercode = u.usercode ORDER BY p.idx";
    // SELECT 
    //     p.idx, 
    //     p.usercode, 
    //     u.nickname, 
    //     p.`depth`, 
    //     p.parent, 
    //     p.parent_idx, 
    //     p.is_delete, 
    //     p.is_secret, 
    //     p.comment, 
    //     p.`date` 
    // FROM post_comment p, user u 
    // WHERE 
    //     p.board = ? AND 
    //     p.post_no = ? AND 
    //     p.usercode = u.usercode 
    // ORDER BY p.idx
    try {
        const [rows] = await pool.query(getQuery, [
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

const getComment = async (
    boardType: string,
    postNo: number,
    idx: number
): Promise<CommentEntity | null> => {
    const getCommentQuery="SELECT c.idx, c.usercode, u.nickname, c.`depth`, c.parent, c.parent_idx, c.is_delete, c.is_secret, c.comment, c.`date` FROM post_comment c, user u WHERE c.board = ? AND c.post_no = ? AND c.idx = ? AND c.is_delete = 0 AND c.usercode = u.usercode ORDER BY c.idx";
    // SELECT 
    //     c.idx, 
    //     c.usercode, 
    //     u.nickname, 
    //     c.`depth`, 
    //     c.parent, 
    //     c.parent_idx, 
    //     c.is_delete, 
    //     c.is_secret, 
    //     c.comment, 
    //     c.`date` 
    // FROM post_comment c, user u 
    // WHERE 
    //     c.board = ? AND 
    //     c.post_no = ? AND 
    //     c.idx = ? AND 
    //     c.is_delete = 0 AND 
    //     c.usercode = u.usercode 
    // ORDER BY c.idx
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
    parentIdx: number | null,
    usercode: number,
    comment: string,
    isSecret: boolean
) => {
    const insertCommentQuery="INSERT INTO post_comment (board, post_no, idx, depth, parent_idx, usercode, comment, is_secret, date) SELECT ?,?, COUNT(idx)+1, ?, ?, ?, ?, ?, now() FROM post_comment WHERE board = ?";
    // INSERT INTO post_comment (
    //     board, 
    //     post_no, 
    //     idx, 
    //     depth, 
    //     parent_idx, 
    //     usercode, 
    //     comment, 
    //     is_secret, 
    //     date) 
    // SELECT 
    //     ?,
    //     ?, 
    //     COUNT(idx)+1, 
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
            usercode, 
            comment,
            isSecret,
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updateParentComment = async (
    boardType: string,
    idx: number
) => {
    const updateParentQuery="UPDATE post_comment SET `parent` = 1 WHERE board = ? AND idx = ?";
    // UPDATE post_comment 
    // SET `parent` = 1 
    // WHERE 
    //     board = ? AND 
    //     idx = ?
    try {
        await pool.query(updateParentQuery, [
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
    const deleteQuery="UPDATE post_comment SET is_delete = 1 WHERE board = ? AND post_no = ? AND idx = ?";
    // UPDATE post_comment 
    // SET is_delete = 1 
    // WHERE 
    //     board = ? AND 
    //     post_no = ? AND 
    //     idx = ?
    try {
        await pool.query(deleteQuery, [
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