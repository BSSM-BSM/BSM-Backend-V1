const conn = require('../db')

let result=new Array()

const view = (boardType, postNo) => {
    result=new Array()
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
            }
            resolve(result)
        })
    })
}
const write = (boardType, memberCode, memberNickname, postTitle, postContent) => {
    result=new Array()
	let postQuery="INSERT INTO `"+boardType+"`(member_code, member_nickname, post_title, post_content, post_data) values("+memberCode+", '"+memberNickname+"', '"+postTitle+"', '"+postContent+"', now())"
	return new Promise(reslove => {
		conn.query(postQuery, (error) => {
			if(error) resolve(error)
			result={
				status:1
			}
			reslove(result)
		})
    })
}
const del = (boardType, postNo) => {
    result=new Array()
}

module.exports = {
    view:view,
    write:write,
    del:del,
}