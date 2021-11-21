const conn = require('../db')
const getMembersLevel = require('./membersLevel')


let result=new Array()

const view = async (boardType, isAnonymous) => {
    let membersLevel = await getMembersLevel.get()
    result=new Array()
    const boardQuery="SELECT * FROM ?? WHERE `post_deleted`=0 ORDER BY `post_no` DESC"
    const params=[boardType]
    return new Promise(resolve => {
        conn.query(boardQuery, params, (error, rows) => {
            if(error) resolve(error)
            if(!rows.length) resolve({status:3,subStatus:6})
            else{
                for(let i=0;i<Object.keys(rows).length;i++){
                    if(membersLevel[rows[i].member_code]>0){
                        rows[i].member_level=membersLevel[rows[i].member_code]
                    }else{
                        rows[i].member_level=0
                    }
                    if(isAnonymous){
                        rows[i].member_code=-1
                        rows[i].member_level=0
                        rows[i].member_nickname='ㅇㅇ'
                    }
                    result[i]={
                        boardType:boardType,
                        postNo:rows[i].post_no,
                        postTitle:rows[i].post_title,
                        postComments:rows[i].post_comments,
                        memberCode:rows[i].member_code,
                        memberNickname:rows[i].member_nickname,
                        memberLevel:rows[i].member_level,
                        postDate:rows[i].post_date,
                        postHit:rows[i].post_hit,
                        postLike:rows[i].like,
                    };
                }
                resolve(result)
            }
        })
    })
}

module.exports = {
    view:view,
}