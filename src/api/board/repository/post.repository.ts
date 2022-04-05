import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getPostByCode = async (
    boardType: string,
    postNo: number
) => {
    const getPostQuery='SELECT * FROM post WHERE post_no = ? AND board = ?';
    // SELECT * 
    // FROM post 
    // WHERE 
    //     post_no = ? AND
    //     board = ?
    try {
        const [rows] = await pool.query(getPostQuery, [
            postNo,
            boardType
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

const getMemberCodeFromPost = async (
    boardType: string,
    postNo: number
) => {
    const getPostQuery='SELECT member_code FROM post WHERE post_no = ? AND board = ?';
    // SELECT member_code 
    // FROM post 
    // WHERE 
    //     post_no = ? AND
    //     board = ?
    try {
        const [rows] = await pool.query(getPostQuery, [
            postNo,
            boardType
        ]);
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
    const insertPostQuery='INSERT INTO post (board, post_no, member_code, member_nickname, post_title, post_content, post_date) SELECT ?, COUNT(post_no)+1, ?, ?, ?, ?, now() FROM post WHERE board = ?';
    // INSERT INTO post (
    //     board,
    //     post_no, 
    //     member_code, 
    //     member_nickname, 
    //     post_title, 
    //     post_content, 
    //     post_date) 
    // SELECT 
    //     ?, 
    //     COUNT(post_no)+1, 
    //     ?, 
    //     ?, 
    //     ?, 
    //     ?, 
    //     now()
    // FROM post
    // WHERE board = ?
    try {
        await pool.query(insertPostQuery, [
            boardType,
            memberCode,
            memberNickname,
            postTitle,
            postContent,
            boardType
        ]);
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
    const updatePostQuery='UPDATE post SET post_title = ?, post_content = ? WHERE post_no = ? AND board = ?';
    // UPDATE post 
    // SET 
    //     post_title = ?, 
    //     post_content = ? 
    // WHERE 
    //     post_no = ? AND 
    //     board = ?
    try {
        await pool.query(updatePostQuery, [
            postTitle,
            postContent,
            postNo,
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePostHit = (
    boardType: string,
    postNo: number
) => {
    const updatePostQuery='UPDATE post SET post_hit = post_hit+1 WHERE post_no=? AND board = ?';
    // UPDATE post 
    // SET post_hit = post_hit+1 
    // WHERE post_no=? AND
    // board = ?
    try {
        pool.query(updatePostQuery, [
            postNo,
            boardType
        ]);
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
    const updatePostQuery='UPDATE post SET post_comments = post_comments+? WHERE post_no = ? AND board = ?';
    // UPDATE post 
    // SET post_comments = post_comments+? 
    // WHERE post_no = ? AND
    // board = ?
    try {
        pool.query(updatePostQuery, [
            commentCount, 
            postNo,
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const deletePost = async (
    boardType: string,
    postNo: number
) => {
    const deletePostQuery='UPDATE post SET post_deleted = 1 WHERE post_no = ? AND board = ?';
    // UPDATE post 
    // SET post_deleted = 1 
    // WHERE post_no = ? AND
    // board = ?
    try {
        await pool.query(deletePostQuery, [
            postNo,
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getPostTotalLike = async (boardType: string, postNo: number) => {
    const getPostLikeQuery='SELECT `like` FROM post WHERE post_no = ? AND board = ?';
    // SELECT `like` 
    // FROM post 
    // WHERE post_no = ? AND
    // board = ?
    try {
        const [rows] = await pool.query(getPostLikeQuery, [
            postNo,
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

const updatePostTotalLike = async (boardType: string, postNo: number, like: number) => {
    const updaetPostTotalLikeQuery='UPDATE post SET `like`=`like`+? WHERE `post_no`=? AND board = ?';
    // UPDATE post 
    // SET `like`=`like`+? 
    // WHERE 
    //     `post_no`=? 
    //     AND board = ?
    try {
        await pool.query(updaetPostTotalLikeQuery, [
            like, 
            postNo,
            boardType
        ]);
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