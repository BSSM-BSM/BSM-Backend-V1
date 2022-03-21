import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getPostByCode = async (
    boardType: string,
    postNo: number
) => {
    const getPostQuery='SELECT * FROM ?? WHERE `post_no`=?';
    try {
        const [rows] = await pool.query(getPostQuery, [boardType, postNo]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getMemberCodeFromPost = async (
    boardType: string,
    postNo: number
) => {
    const getPostQuery='SELECT `member_code` FROM ?? WHERE `post_no`=?';
    try {
        const [rows] = await pool.query(getPostQuery, [boardType, postNo]);
        if (rows.length)
            return rows[0].member_code;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const insertPost = async (
    boardType: string,
    memberCode: number,
    memberNickname: string,
    postTitle :string,
    postContent: string
) => {
    const insertPostQuery="INSERT INTO ?? (member_code, member_nickname, post_title, post_content, post_date) values(?, ?, ?, ?, now())";
    try {
        await pool.query(insertPostQuery, [boardType, memberCode, memberNickname, postTitle, postContent]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePost = async (
    boardType: string,
    postTitle :string,
    postContent: string,
    postNo: number
) => {
    const updatePostQuery="UPDATE ?? SET `post_title`=?, `post_content`=? WHERE `post_no`=?";
    try {
        await pool.query(updatePostQuery, [boardType, postTitle, postContent, postNo]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePostHit = (
    boardType: string,
    postNo: number
) => {
    const updatePostQuery='UPDATE ?? SET `post_hit`=`post_hit`+1 WHERE `post_no`=?';
    try {
        pool.query(updatePostQuery, [boardType, postNo]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePostComments = (
    boardType: string,
    postNo: number,
    commentCount: number
) => {
    const updatePostQuery='UPDATE ?? SET `post_comments`=`post_comments`+? WHERE `post_no`=?';
    try {
        pool.query(updatePostQuery, [boardType, postNo, commentCount]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const deletePost = async (
    boardType: string,
    postNo: number
) => {
    const deletePostQuery="UPDATE ?? SET `post_deleted`=1 WHERE `post_no`=?";
    try {
        await pool.query(deletePostQuery, [boardType, postNo]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getPostTotalLike = async (boardType: string, postNo: number) => {
    const getPostLikeQuery='SELECT `like` FROM ?? WHERE `post_no`=?';
    try {
        const [rows] = await pool.query(getPostLikeQuery, [boardType, postNo]);
        if (rows.length)
            return rows[0].like;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePostTotalLike = async (boardType: string, postNo: number, like: number) => {
    const updaetPostTotalLikeQuery='UPDATE ?? SET `like`=`like`+? WHERE `post_no`=?';
    try {
        await pool.query(updaetPostTotalLikeQuery, [boardType, like, postNo]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

module.exports = {
    getPostByCode,
    getMemberCodeFromPost,
    insertPost,
    updatePost,
    updatePostHit,
    updatePostComments,
    deletePost,
    getPostTotalLike,
    updatePostTotalLike
}