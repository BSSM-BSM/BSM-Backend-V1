const conn = require('../db')

let result=new Array()

const view = (memberCode, memberLevel, boardType, likeBoardType, postNo, isAnonymous) => {
    result=new Array()
    const postQuery="SELECT * FROM ?? WHERE `post_no`=?"
    const params=[boardType, postNo]
    return new Promise(resolve => {
        conn.query(postQuery, params, (error, rows) => {
            if(error) resolve({status:2,subStatus:0})
            if(!rows.length) resolve({status:3,subStatus:6})
            else{
                rows=rows[0]
                if(memberCode>0 && rows.member_code===memberCode || memberLevel>=3){
                    rows.permission=true;
                }else{
                    rows.permission=false;
                }
                if(isAnonymous){
                    rows.member_code=-1
                    rows.member_level=0
                    rows.member_nickname='ㅇㅇ'
                }
                result={
                    status:1,
                    subStatus:0,
                    postTitle:rows.post_title,
                    postComments:rows.post_comments,
                    postContent:rows.post_content,
                    memberCode:rows.member_code,
                    memberNickname:rows.member_nickname,
                    postDate:rows.post_date,
                    postHit:rows.post_hit,
                    postLike:rows.like,
                    permission:rows.permission,
                }
                const likeCheckQuery="SELECT `like` FROM ?? WHERE `post_no`= ? AND `member_code`=?"
                const likeCheckParams=[likeBoardType, postNo, memberCode]
                conn.query(likeCheckQuery, likeCheckParams, (error, likeCheck) => {
                    if(error) resolve({status:2,subStatus:0})
                    if(likeCheck.length){
                        result['like']=likeCheck[0].like
                    }else{
                        result['like']=0
                    }
                    const postHitQuery="UPDATE ?? SET `post_hit`=`post_hit`+1 WHERE `post_no`=?"
                    const params=[boardType, postNo]
                    conn.query(postHitQuery, params, (error) => {
                        if(error) resolve({status:2,subStatus:0})
                        resolve(result)
                    })
                })
            }
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
const update = (memberCode, memberLevel, boardType, postNo, postTitle, postContent) => {
    result=new Array()
    const postCheckQuery="SELECT `member_code` FROM ?? WHERE `post_no`=?"
    const params=[boardType, postNo]
    return new Promise(resolve => {
        conn.query(postCheckQuery, params, (error, checkMemberCode) => {
            if(error) resolve({status:2,subStatus:0})
            if(checkMemberCode[0].member_code==memberCode || memberLevel>=3){
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
const del = (memberCode, memberLevel, boardType, postNo) => {
    result=new Array()
    const postCheckQuery="SELECT `member_code` FROM ?? WHERE `post_no`=?"
    const params=[boardType, postNo]
    return new Promise(resolve => {
        conn.query(postCheckQuery, params, (error, checkMemberCode) => {
            if(error) resolve({status:2,subStatus:0})
            if(checkMemberCode[0].member_code==memberCode || memberLevel>=3){
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