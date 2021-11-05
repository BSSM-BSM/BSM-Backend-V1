const conn = require('../db')
const getMembersLevel = require('./membersLevel')

let result=new Array()

const view = async (commentBoardType, postNo) => {
    let membersLevel = await getMembersLevel.get()
    result=new Array()
    let commentViewQuery="SELECT * FROM `"+commentBoardType+"` WHERE `post_no`="+postNo+" AND `comment_deleted`=0 ORDER BY `order`;"
    return new Promise(resolve => {
        conn.query(commentViewQuery, (error, results) => {
            if(error) resolve(error)
            for(let i=0;i<Object.keys(results).length;i++){
                if(membersLevel[results[i].member_code]>0){
                    results[i].member_level=membersLevel[results[i].member_code]
                }else{
                    results[i].member_level=0
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
    let commentIndexQuery="SELECT `order` from `"+commentBoardType+"` where `depth`=0 and `post_no`="+postNo+" order by `comment_index` desc limit 1;"
    return new Promise(resolve => {
        conn.query(commentIndexQuery, (error, order) => {
            if(error) resolve(error)
            if(order[0].order==null){
                order = 1;
            }else{
                order = order[0].order+1;
            }
            let commentWriteQuery="INSERT INTO `"+commentBoardType+"` (`post_no`, `depth`, `order`, `parent_no`, `member_code`, `member_nickname`, `comment`, `comment_date`) VALUES ("+postNo+", 0, "+order+", NULL, "+memberCode+", '"+memberNickname+"', '"+comment+"', now());"
            conn.query(commentWriteQuery, (error) => {
                if(error) resolve(error)
                let commentUpdateQuery = "UPDATE `"+boardType+"` set `post_comments`=`post_comments`+1 where `post_no`="+postNo
                conn.query(commentUpdateQuery, (error) => {
                    if(error) resolve(error)
                    resolve(1)
                })
            })
        })
    })
}
const del = (boardType, commentBoardType, postNo, memberCode, commentIndex) => {
    result=new Array()
    let commentCheckQuery="SELECT `member_code` FROM `"+commentBoardType+"` WHERE `comment_index`= "+commentIndex+" AND `post_no`="+postNo
    return new Promise(resolve => {
        conn.query(commentCheckQuery, (error, checkMemberCode) => {
            if(error) resolve(error)
            if(checkMemberCode[0].member_code==memberCode){
                let commentDeleteQuery="UPDATE `"+commentBoardType+"` SET `comment_deleted` = 1 WHERE `comment_index`= "+commentIndex+" AND `post_no`="+postNo
                conn.query(commentDeleteQuery, (error) => {
                    if(error) resolve(error)
                    let commentUpdateQuery = "UPDATE `"+boardType+"` set `post_comments`=`post_comments`-1 where `post_no`="+postNo
                    conn.query(commentUpdateQuery, (error) => {
                        if(error) resolve(error)
                        resolve(1)
                    })
                })
            }else{
                resolve(20)
            }
        })
    })
}

module.exports = {
    view:view,
    write:write,
    del:del,
}