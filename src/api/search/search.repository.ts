const { InternalServerException } = require('../../util/exceptions');
const pool = require('../../util/db');

const getBoard = async (searchType: string, searchStr:string) => {
    const searchQuery="SELECT * FROM ?? WHERE MATCH(post_title, post_content) AGAINST(? IN BOOLEAN MODE) AND `post_deleted`=0 ORDER BY `post_no` DESC"
    try{
        const [rows] = await pool.query(searchQuery, [searchType, searchStr])
        if(rows.length)
            return rows;
        else
            return null;
    }catch(err){
        console.error(err)
        throw new InternalServerException();
    }
}

module.exports = {
    getBoard,
}