const conn = require('../db')

const getBoard = (searchType, searchStr) => {
    const searchQuery="SELECT * FROM ?? WHERE MATCH(post_title, post_content) AGAINST(? IN BOOLEAN MODE) AND `post_deleted`=0 ORDER BY `post_no` DESC"
    const params=[searchType, searchStr]
    return new Promise(resolve => {
        conn.query(searchQuery, params, (error, rows) => {
            if(error) resolve(false)
            resolve(rows)
        })
    })
}

module.exports = {
    getBoard:getBoard,
}