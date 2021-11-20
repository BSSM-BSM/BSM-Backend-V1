const conn = require('../db')
const getMembersLevel = require('./membersLevel')


let result=new Array()

const view = async (boardType, isAnonymous) => {
    let membersLevel = await getMembersLevel.get()
    result=new Array()
    const boardQuery="SELECT * FROM ?? WHERE `post_deleted`=0 ORDER BY `post_no` DESC"
    const params=[boardType]
    return new Promise(resolve => {
        conn.query(boardQuery, params, (error, results) => {
            if(error) resolve(error)
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
                    boardType:boardType,
                    postNo:results[i].post_no,
                    postTitle:results[i].post_title,
                    postComments:results[i].post_comments,
                    memberCode:results[i].member_code,
                    memberNickname:results[i].member_nickname,
                    memberLevel:results[i].member_level,
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