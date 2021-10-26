const conn = require('../db')

let result=new Array()

const view = (commentBoardType, postNo) => {
    let viewCommentQuery="SELECT * FROM `"+commentBoardType+"` WHERE `post_no`="+postNo+" AND `comment_deleted`=0 ORDER BY `order`;"
    return new Promise(resolve => {
        conn.query(viewCommentQuery, (error, results) => {
            if(error) resolve(error)
            for(let i=0;i<Object.keys(results).length;i++){
                result[i]={
                    Idx:results[i].comment_index,
                    memberCode:results[i].member_code,
                    memberNickname:results[i].member_nickname,
                    memberLevel:results[i].member_level,
                    comment:results[i].comment,
                    commentDate:results[i].comment_date,
                };
            }
            resolve(result)
        })
    })
}
const write = (boardType) => {
}
const del = (boardType) => {
}

module.exports = {
    view:view,
    write:write,
    del:del,
}