import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getBoardType = async (): Promise<[{
    id: string,
    name: string,
    sub_board_id: string,
    sub_board_name: string,
    post_level: string,
    post_public: string,
    post_anonymous: string,
    comment_level: string,
    comment_public: string,
    comment_anonymous: string,
    like_level: string
}] | null> => {
    const getBoardTypeQuery="SELECT id, name, sub_board_id, sub_board_name, post_level, post_public, post_anonymous, comment_level, comment_public, comment_anonymous, like_level FROM board";
    // SELECT 
    //     id, 
    //     name, 
    //     sub_board_id, 
    //     sub_board_name, 
    //     post_level, 
    //     post_public, 
    //     post_anonymous, 
    //     comment_level, 
    //     comment_public, 
    //     comment_anonymous, 
    //     like_level 
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

const getTotalPosts = async (
    boardType: string,
    category: string
): Promise<number | null> => {
    let getQuery;
    if (category == 'all') {
        getQuery='SELECT COUNT(post_no) FROM post WHERE deleted = 0 AND board = ?';
        // SELECT COUNT(post_no) 
        // FROM post 
        // WHERE 
        //     deleted = 0 AND 
        //     board = ?
    } else if (category == 'normal') {
        getQuery='SELECT COUNT(post_no) FROM post WHERE deleted = 0 AND board = ? AND category IS NULL';
        // SELECT COUNT(post_no) 
        // FROM post 
        // WHERE 
        //     deleted = 0 AND 
        //     board = ? AND
        //     category IS NULL
    } else {
        getQuery='SELECT COUNT(post_no) FROM post WHERE deleted = 0 AND board = ? AND category = ?';
        // SELECT COUNT(post_no) 
        // FROM post 
        // WHERE 
        //     deleted = 0 AND 
        //     board = ? AND 
        //     category = ?
    }
    try {
        const [rows] = await pool.query(getQuery, [boardType, category]);
        if (rows.length)
            return rows[0]['COUNT(post_no)'];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getPostsByPage = async (
    boardType: string,
    startPage: number,
    limitPage: number,
    category: string
): Promise<[{
    postNo: number,
    title: string,
    comments: number,
    usercode: number,
    nickname: string,
    date: string,
    hit: number,
    totalLike: number,
    category: string
}] | null> => {
    let getQuery;
    let params = [];
    if (category == 'all') {
        getQuery="SELECT p.post_no postNo, p.title, p.comments, p.usercode, u.nickname, p.date, p.hit, p.total_like totalLike, p.category FROM post p, user u WHERE p.deleted = 0 AND p.board = ? AND p.usercode = u.usercode ORDER BY post_no DESC LIMIT ?, ?";
        // SELECT 
        //     p.post_no postNo, 
        //     p.title, 
        //     p.comments, 
        //     p.usercode, 
        //     u.nickname, 
        //     p.date, 
        //     p.hit, 
        //     p.total_like totalLike, 
        //     p.category 
        // FROM post p, user u 
        // WHERE 
        //     p.deleted = 0 AND 
        //     p.board = ? AND 
        //     p.usercode = u.usercode 
        // ORDER BY post_no DESC LIMIT ?, ?
        params = [
            boardType, 
            startPage, 
            limitPage
        ]
    } else if (category == 'normal') {
        getQuery="SELECT p.post_no postNo, p.title, p.comments, p.usercode, u.nickname, p.date, p.hit, p.total_like totalLike, p.category FROM post p, user u WHERE p.deleted = 0 AND p.board = ? AND p.category IS NULL AND p.usercode = u.usercode ORDER BY post_no DESC LIMIT ?, ?";
        // SELECT 
        //     p.post_no postNo, 
        //     p.title, 
        //     p.comments, 
        //     p.usercode, 
        //     u.nickname, 
        //     p.date, 
        //     p.hit, 
        //     p.total_like totalLike, 
        //     p.category 
        // FROM post p, user u 
        // WHERE 
        //     p.deleted = 0 AND 
        //     p.board = ? AND 
        //     p.category IS NULL AND 
        //     p.usercode = u.usercode 
        // ORDER BY post_no DESC LIMIT ?, ?
        params = [
            boardType, 
            startPage, 
            limitPage
        ]
    } else {
        getQuery="SELECT p.post_no postNo, p.title, p.comments, p.usercode, u.nickname, p.date, p.hit, p.total_like totalLike, p.category FROM post p, user u WHERE p.deleted = 0 AND p.board = ? AND p.category = ? AND p.usercode = u.usercode ORDER BY post_no DESC LIMIT ?, ?";
        // SELECT 
        //     p.post_no postNo, 
        //     p.title, 
        //     p.comments, 
        //     p.usercode, 
        //     u.nickname, 
        //     p.date, 
        //     p.hit, 
        //     p.total_like totalLike, 
        //     p.category 
        // FROM post p, user u 
        // WHERE 
        //     p.deleted = 0 AND 
        //     p.board = ? AND 
        //     p.category = ? AND 
        //     p.usercode = u.usercode 
        // ORDER BY post_no DESC LIMIT ?, ?
        params = [
            boardType, 
            category,
            startPage, 
            limitPage
        ]
    }
    
    try {
        const [rows] = await pool.query(getQuery, params);
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