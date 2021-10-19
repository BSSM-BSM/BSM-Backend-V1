const conn = require('../db')

let result=new Array()

const view = (boardType) => {
    let boardQuery="SELECT * FROM `"+boardType+"` WHERE `post_deleted`=0 ORDER BY `post_no` DESC;"
    return new Promise(resolve => {
        conn.query(boardQuery, (error, results) => {
            if(error) resolve(error)
            for(let i=0;i<Object.keys(results).length;i++){
                result[i]={
                    boardType:boardType,
                    postNo:results[i].post_no,
                    postTitle:results[i].post_title,
                    postComments:results[i].post_comments,
                    memberCode:results[i].member_code,
                    memberNickname:results[i].member_nickname,
                    postDate:results[i].post_date,
                    postHit:results[i].post_hit,
                    postLike:results[i].like,
                };
            }
            resolve(result)
        })
    })
}

module.exports = {
    view:view,
}