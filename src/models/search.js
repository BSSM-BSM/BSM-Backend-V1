const pool = require('../db')

const getBoard = async (searchType, searchStr) => {
    let rows
    const searchQuery="SELECT * FROM ?? WHERE MATCH(post_title, post_content) AGAINST(? IN BOOLEAN MODE) AND `post_deleted`=0 ORDER BY `post_no` DESC"
    try{
        [rows] = await pool.query(searchQuery, [searchType, searchStr])
    }catch(err){
        console.error(err)
        return null;
    }
    return rows
}

module.exports = {
    getBoard:getBoard,
}