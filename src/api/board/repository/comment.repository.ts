import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getComments = async (boardType: string, postNo: number) => {
    const getCommentsQuery="SELECT * FROM ?? WHERE `post_no`=? ORDER BY `comment_index`";
    try {
        const [rows] = await pool.query(getCommentsQuery, [boardType+'_comment', postNo]);
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
    const getCommentQuery="SELECT * FROM ?? WHERE `post_no`=? AND `comment_index`=? AND `comment_deleted`=0";
    try {
        const [rows] = await pool.query(getCommentQuery, [boardType+'_comment', postNo, idx]);
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
    const insertCommentQuery="INSERT INTO ?? (`post_no`, `depth`, `parent_idx`, `member_code`, `member_nickname`, `comment`, `comment_date`) VALUES (?, ?, ?, ?, ?, ?, now());";
    try {
        await pool.query(insertCommentQuery, [boardType+'_comment', postNo, depth, parentIdx, memberCode, memberNickname, comment]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updateParentComment = async (boardType: string, idx: number) => {
    const updateParentCommentQuery="UPDATE ?? SET `parent`=1 WHERE `comment_index`=?";
    try {
        await pool.query(updateParentCommentQuery, [boardType+'_comment', idx]);
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
    const deleteCommentQuery="UPDATE ?? SET `comment_deleted`=1 WHERE `post_no`=? AND comment_index=?";
    try {
        await pool.query(deleteCommentQuery, [boardType+'_comment', postNo, idx]);
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