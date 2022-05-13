import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getPost = async (
    boardType: string,
    postNo: number
): Promise<{
    deleted?: Boolean,
    usercode: number,
    nickname: string,
    title: string,
    content: string,
    date: string,
    hit: number,
    comments: number,
    totalLike: number
} | null> => {
    const getPostQuery="SELECT p.deleted, p.usercode, u.nickname, p.title, p.content, p.date, p.hit, p.comments, p.total_like totalLike FROM post p, user u WHERE p.post_no = ? AND p.board = ? AND p.usercode = u.usercode";
    // SELECT 
    //     p.deleted, 
    //     p.usercode, 
    //     u.nickname, 
    //     p.title, 
    //     p.content, 
    //     p.date, 
    //     p.hit, 
    //     p.comments, 
    //     p.total_like totalLike 
    // FROM post p, user u 
    // WHERE 
    //     p.post_no = ? AND 
    //     p.board = ? AND 
    //     p.usercode = u.usercode
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

const getUsercode = async (
    boardType: string,
    postNo: number
): Promise<number | null> => {
    const getQuery='SELECT usercode FROM post WHERE post_no = ? AND board = ?';
    // SELECT usercode 
    // FROM post 
    // WHERE 
    //     post_no = ? AND
    //     board = ?
    try {
        const [rows] = await pool.query(getQuery, [
            postNo,
            boardType
        ]);
        if (rows.length)
            return Number(rows[0].usercode);
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const insertPost = async (
    boardType: string,
    usercode: number,
    title :string,
    content: string,
    category: string | null
) => {
    const insertQuery="INSERT INTO post (board, post_no, usercode, title, content, date, category)SELECT ?, COUNT(post_no)+1, ?, ?, ?, now(), ? FROM post WHERE board = ?";
    // INSERT INTO post (
    //     board, 
    //     post_no, 
    //     usercode, 
    //     title, 
    //     content, 
    //     date, 
    //     category) 
    // SELECT 
    //     ?, 
    //     COUNT(post_no)+1, 
    //     ?, 
    //     ?, 
    //     ?, 
    //     now(), 
    //     ? 
    // FROM post 
    // WHERE board = ?
    try {
        await pool.query(insertQuery, [
            boardType,
            usercode,
            title,
            content,
            category,
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePost = async (
    boardType: string,
    postNo: number,
    title :string,
    content: string,
    category: string | null
) => {
    const updateQuery="UPDATE post SET title = ?, content = ?, category = ? WHERE post_no = ? AND board = ?";
    // UPDATE post 
    // SET 
    //     title = ?, 
    //     content = ?, 
    //     category = ? 
    // WHERE 
    //     post_no = ? AND 
    //     board = ?
    try {
        await pool.query(updateQuery, [
            title,
            content,
            category,
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
    const updateQuery="UPDATE post SET hit = hit+1 WHERE post_no = ? AND board = ?";
    // UPDATE post 
    // SET hit = hit+1 
    // WHERE post_no = ? AND 
    // board = ?
    try {
        pool.query(updateQuery, [
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
    const updateQuery="UPDATE post SET comments = comments+? WHERE post_no = ? AND board = ?";
    // UPDATE post 
    // SET comments = comments+? 
    // WHERE post_no = ? AND 
    // board = ?
    try {
        pool.query(updateQuery, [
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
    const deleteQuery="UPDATE post SET deleted = 1 WHERE post_no = ? AND board = ?";
    // UPDATE post 
    // SET deleted = 1 
    // WHERE post_no = ? AND
    // board = ?
    try {
        await pool.query(deleteQuery, [
            postNo,
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getPostTotalLike = async (
    boardType: string,
    postNo: number
): Promise<number | null> => {
    const getPostLikeQuery="SELECT total_like totalLike FROM post WHERE post_no = ? AND board = ?";
    // SELECT total_like totalLike 
    // FROM post 
    // WHERE post_no = ? AND
    // board = ?
    try {
        const [rows] = await pool.query(getPostLikeQuery, [
            postNo,
            boardType
        ]);
        if (rows.length)
            return rows[0].totalLike;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePostTotalLike = async (
    boardType: string,
    postNo: number,
    like: number
) => {
    const updateQuery="UPDATE post SET total_like = total_like+? WHERE post_no = ? AND board = ?";
    // UPDATE post 
    // SET total_like = total_like+? 
    // WHERE 
    //     post_no = ? AND 
    //     board = ?
    try {
        await pool.query(updateQuery, [
            like, 
            postNo,
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getPost,
    getUsercode,
    insertPost,
    updatePost,
    updatePostHit,
    updatePostComments,
    deletePost,
    getPostTotalLike,
    updatePostTotalLike
}