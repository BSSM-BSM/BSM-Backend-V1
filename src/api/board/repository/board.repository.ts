import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getBoardType = async () => {
    const getBoardTypeQuery='SELECT * FROM board';
    // SELECT * 
    // FROM board 
    try {
        const [rows] = await pool.query(getBoardTypeQuery);
        if (rows.length)
            return rows;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getTotalPosts = async (boardType: string) => {
    const totalPostQuery='SELECT COUNT(post_no) FROM post WHERE post_deleted = 0 AND board = ?';
    // SELECT COUNT(post_no) 
    // FROM post 
    // WHERE 
    //     post_deleted = 0 AND
    //     board = ?
    try {
        const [rows] = await pool.query(totalPostQuery, [boardType]);
        if (rows.length)
            return rows[0]['COUNT(post_no)'];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getPostsByPage = async (boardType: string, startPage: number, limitPage: number) => {
    const getBoardQuery='SELECT post_no, post_title, post_comments, member_code, member_nickname, post_date, post_hit, `like` FROM post WHERE post_deleted = 0 AND board = ? ORDER BY post_no DESC LIMIT ?, ?';
    // SELECT 
    //     post_no, 
    //     post_title, 
    //     post_comments, 
    //     member_code, 
    //     member_nickname, 
    //     post_date, 
    //     post_hit, 
    //     `like` 
    // FROM post 
    // WHERE 
    //     post_deleted = 0 AND
    //     board = ? 
    // ORDER BY post_no DESC LIMIT ?, ?
    try {
        const [rows] = await pool.query(getBoardQuery, [
            boardType, 
            startPage, 
            limitPage
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

export {
    getBoardType,
    getTotalPosts,
    getPostsByPage
}