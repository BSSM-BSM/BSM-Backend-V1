const conn = require('../db')

let result=new Array()

const view = (boardType, postNo) => {
    let postQuery="SELECT * FROM `"+boardType+"` WHERE `post_no`="+postNo
    return new Promise(resolve => {
        conn.query(postQuery, (error, results) => {
            if(error) resolve(error)
            results=results[0];
            result={
                status:1,
                postTitle:results.post_title,
                postComments:results.post_comments,
                postContent:results.post_content,
                memberCode:results.member_code,
                memberNickname:results.member_nickname,
                postDate:results.post_date,
                postHit:results.post_hit,
                postLike:results.like,
            };
            resolve(result)
        })
    })
}

module.exports = {
    view:view,
}