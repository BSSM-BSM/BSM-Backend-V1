const conn = require('../db')
const getMembersLevel = require('./membersLevel')

let result=new Array()

const view = async (commentBoardType, postNo, isAnonymous) => {
    let membersLevel = await getMembersLevel.get()
    result=new Array()
    const commentViewQuery="SELECT * FROM ?? WHERE `post_no`=? AND `comment_deleted`=0 ORDER BY `order`"
    const params=[commentBoardType, postNo]
    return new Promise(resolve => {
        conn.query(commentViewQuery, params, (error, results) => {
            if(error) resolve({status:2,subStatus:0})
            for(let i=0;i<Object.keys(results).length;i++){
                if(membersLevel[results[i].member_code]>0){
                    results[i].member_level=membersLevel[results[i].member_code]
                }else{
                    results[i].member_level=0
                }
                if(isAnonymous){
                    results[i].member_code=-1
                    results[i].member_level=0
                    results[i].member_nickname='ㅇㅇ'
                }
                result[i]={
                    idx:results[i].comment_index,
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
    result=new Array()
    const commentIndexQuery="SELECT `order` from ?? where `depth`=0 and `post_no`=? order by `comment_index` desc limit 1"
    const params=[commentBoardType, postNo]
    return new Promise(resolve => {
        conn.query(commentIndexQuery, params, (error, order) => {
            if(error) resolve({status:2,subStatus:0})
            if(order[0]==null){
                order = 1;
            }else{
                order = order[0].order+1;
            }
            const commentWriteQuery="INSERT INTO ?? (`post_no`, `depth`, `order`, `parent_no`, `member_code`, `member_nickname`, `comment`, `comment_date`) VALUES (?, 0, ?, NULL, ?, ?, ?, now());"
            const params=[commentBoardType, postNo, order, memberCode, memberNickname, comment]
            conn.query(commentWriteQuery, params, (error) => {
                if(error) resolve({status:2,subStatus:0})
                const commentUpdateQuery = "UPDATE ?? set `post_comments`=`post_comments`+1 where `post_no`=?"
                const params=[boardType, postNo]
                conn.query(commentUpdateQuery, params, (error) => {
                    if(error) resolve({status:2,subStatus:0})
                    resolve({status:1,subStatus:0})
                })
            })
        })
    })
}
const del = (boardType, commentBoardType, postNo, memberCode, commentIndex) => {
    result=new Array()
    const commentCheckQuery="SELECT `member_code` FROM ?? WHERE `comment_index`= ? AND `post_no`=?"
    const params=[commentBoardType, commentIndex, postNo]
    return new Promise(resolve => {
        conn.query(commentCheckQuery, params, (error, checkMemberCode) => {
            if(error) resolve({status:2,subStatus:0})
            if(checkMemberCode[0].member_code==memberCode){
                const commentDeleteQuery="UPDATE ?? SET `comment_deleted` = 1 WHERE `comment_index`= ? AND `post_no`=?"
                const params=[commentBoardType, commentIndex, postNo]
                conn.query(commentDeleteQuery, params, (error) => {
                    if(error) resolve({status:2,subStatus:0})
                    const commentUpdateQuery = "UPDATE ?? set `post_comments`=`post_comments`-1 where `post_no`=?"
                    const params=[boardType, postNo]
                    conn.query(commentUpdateQuery, params, (error) => {
                        if(error) resolve({status:2,subStatus:0})
                        resolve({status:1,subStatus:0})
                    })
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
    del:del,
}