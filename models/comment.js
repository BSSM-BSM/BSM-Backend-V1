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
const write = (boardType, commentBoardType, postNo, memberCode, memberNickname, comment) => {
    let commentIndexQuery="SELECT `order` from `"+commentBoardType+"` where `depth`=0 and `post_no`="+postNo+" order by `comment_index` desc limit 1;"
    return new Promise(resolve => {
        conn.query(commentIndexQuery, (error, order) => {
            if(error) resolve(error)
            if(order[0].order==null){
                order = 1;
            }else{
                order = order[0].order+1;
            }
            commentWriteQuery="INSERT INTO `"+commentBoardType+"` (`post_no`, `depth`, `order`, `parent_no`, `member_code`, `member_nickname`, `comment`, `comment_date`) VALUES ("+postNo+", 0, "+order+", NULL, "+memberCode+", '"+memberNickname+"', '"+comment+"', now());"
            conn.query(commentWriteQuery, (error, results) => {
                if(error) resolve(error)
                commentUpdateQuery = "UPDATE `"+boardType+"` set `post_comments`=`post_comments`+1 where `post_no`="+postNo
                conn.query(commentUpdateQuery, (error, result) => {
                    if(error) resolve(error)
                    resolve(1)
                })
            })
        })
    })
}
const del = (boardType) => {
}

module.exports = {
    view:view,
    write:write,
    del:del,
}