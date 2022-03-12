import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../../util/db');

const getLikeByMemberCode = async (boardType:String, postNo: number, memberCode: number) => {
    const getLikeQuery='SELECT * FROM ?? WHERE `post_no`=? AND `member_code`=?';
    try{
        const [rows] = await pool.query(getLikeQuery, [boardType, postNo, memberCode]);
        if(rows.length)
            return rows[0];
        else
            return null;
    }catch(err){
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getLikeByMemberCode
}