import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getByUsercode = async (
    boardType: string,
    postNo: number,
    usercode: number
): Promise<number | null> => {
    const getQuery="SELECT `like` FROM post_like WHERE post_no = ? AND usercode = ? AND board = ?";
    // SELECT `like` 
    // FROM post_like 
    // WHERE 
    //     post_no = ? AND 
    //     usercode = ? AND 
    //     board = ?
    try {
        const [rows] = await pool.query(getQuery, [
            postNo, 
            usercode, 
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

const insertPostLike = async (
    boardType: string,
    postNo: number,
    like: number,
    usercode: number
) => {
    const insertQuery="INSERT INTO post_like (board, post_no, `like`, usercode) values (?, ?, ?, ?)";
    // INSERT INTO post_like (
    //     board, 
    //     post_no, 
    //     `like`, 
    //     usercode) 
    // values (
    //     ?, 
    //     ?, 
    //     ?)
    try {
        await pool.query(insertQuery, [
            boardType, 
            postNo, 
            like, 
            usercode
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const updatePostLike = async (
    boardType: string,
    postNo: number,
    like: number,
    usercode: number
) => {
    const updateQuery="UPDATE post_like SET `like`=? WHERE post_no = ? AND usercode = ? AND board = ?";
    // UPDATE ?? 
    // SET `like` = ? 
    // WHERE post_no = ? AND 
    // usercode = ? AND 
    // board = ?
    try {
        await pool.query(updateQuery, [
            like, 
            postNo, 
            usercode, 
            boardType
        ]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getByUsercode,
    insertPostLike,
    updatePostLike
}