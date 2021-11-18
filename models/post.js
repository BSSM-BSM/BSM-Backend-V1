const conn = require('../db')

let result=new Array()

const view = (boardType, postNo) => {
    result=new Array()
    const postQuery="SELECT * FROM ?? WHERE `post_no`=?"
    const params=[boardType, postNo]
    return new Promise(resolve => {
        conn.query(postQuery, params, (error, results) => {
            if(error) resolve({status:2,subStatus:0})
            results=results[0];
            result={
                status:1,
                subStatus:0,
                postTitle:results.post_title,
                postComments:results.post_comments,
                postContent:results.post_content,
                memberCode:results.member_code,
                memberNickname:results.member_nickname,
                postDate:results.post_date,
                postHit:results.post_hit,
                postLike:results.like,
            }
            const postHitQuery="UPDATE ?? SET `post_hit`=`post_hit`+1 WHERE `post_no`=?"
            const params=[boardType, postNo]
            conn.query(postHitQuery, params, (error) => {
                if(error) resolve({status:2,subStatus:0})
                resolve(result)
            })
        })
    })
}
const write = (memberCode, memberNickname, boardType, postTitle, postContent) => {
    result=new Array()
	const postQuery="INSERT INTO ?? (member_code, member_nickname, post_title, post_content, post_date) values(?, ?, ?, ?, now())"
    const params=[boardType, memberCode, memberNickname, postTitle, postContent]
	return new Promise(resolve => {
		conn.query(postQuery, params, (error) => {
			if(error) resolve({status:2,subStatus:0})
			resolve({status:1,subStatus:0})
		})
    })
}
const update = (memberCode, boardType, postNo, postTitle, postContent) => {
    result=new Array()
    const postCheckQuery="SELECT `member_code` FROM ?? WHERE `post_no`=?"
    const params=[boardType, postNo]
    return new Promise(resolve => {
        conn.query(postCheckQuery, params, (error, checkMemberCode) => {
            if(error) resolve({status:2,subStatus:0})
            if(checkMemberCode[0].member_code==memberCode){
                const postUpdateQuery="UPDATE ?? SET `post_title`=?, `post_content`=? WHERE `post_no`=?"
                const params=[boardType, postTitle, postContent, postNo]
                conn.query(postUpdateQuery, params, (error) => {
                    if(error) resolve({status:2,subStatus:0})
                    resolve({status:1,subStatus:0})
                })
            }else{
                resolve({status:3,subStatus:8})
            }
        })
    })
}
const del = (memberCode, boardType, postNo) => {
    result=new Array()
    const postCheckQuery="SELECT `member_code` FROM ?? WHERE `post_no`=?"
    const params=[boardType, postNo]
    return new Promise(resolve => {
        conn.query(postCheckQuery, params, (error, checkMemberCode) => {
            if(error) resolve({status:2,subStatus:0})
            if(checkMemberCode[0].member_code==memberCode){
                const postDeleteQuery="UPDATE ?? SET `post_deleted` = 1 WHERE `post_no`=?"
                const params=[boardType, postNo]
                conn.query(postDeleteQuery, params, (error) => {
                    if(error) resolve({status:2,subStatus:0})
                    resolve({status:1,subStatus:0})
                })
            }else{
                resolve({status:3,subStatus:8})
            }
        })
    })
}

module.exports = {
    view:view,
    write:write,
    update,update,
    del:del,
}