const conn = require('../db')
const getMembersLevel = require('./membersLevel')

let result = []
let membersLevel = []
const view = async (memberCode, memberLevel, commentBoardType, postNo, isAnonymous) => {
    membersLevel = await getMembersLevel.get()
    result = []
    const commentViewQuery="SELECT * FROM ?? WHERE `post_no`=? AND `comment_deleted`=0 ORDER BY `comment_index`"
    const params=[commentBoardType, postNo]
    return new Promise(resolve => {
        conn.query(commentViewQuery, params, (error, rows) => {
            if(error) resolve({status:2,subStatus:0})
            result=commentTree(rows, 0, memberCode, memberLevel, isAnonymous);// 대댓글 트리
            resolve(result)
        })
    })
}
const commentTree = (commentList, depth, memberCode, memberLevel, isAnonymous) => {
    let result = [];
    commentList.forEach(e => {
        if(e.depth==depth){// 대댓글의 깊이가 불러오려는 현재 깊이와 같으면
            if(membersLevel[e.member_code]>0){// 관리자 댓글인지 확인
                e.member_level=membersLevel[e.member_code]
            }else{
                e.member_level=0
            }
            if(memberCode>0 && e.member_code===memberCode || memberLevel>=3){// 자신의 댓글인지 확인
                e.permission=true;
            }else{
                e.permission=false;
            }
            if(isAnonymous){// 익명 댓글인지 확인
                e.member_code=-1
                e.member_level=0
                e.member_nickname='ㅇㅇ'
            }
            if(e.parent==1){// 만약 대댓글이 더 있다면
                let childList = []
                commentList.forEach(child => {// 불러오려는 대댓글들만 배열에 넣음
                    if(
                        child.depth!=depth &&// 현재 깊이의 댓글이 아니고
                        !(child.depth==depth+1 && child.parent_idx!=e.comment_index)){
                        /*
                        자신의 자식 댓글들만 불러오기위한 조건문
                        만약 댓글의 깊이가 바로 밑이고 대댓글의 부모가 현재 댓글과 같다면
                        !(1 && 0) -> !(0) -> 1
                        만약 댓글의 깊이가 바로 밑이고 대댓글의 부모가 현재 댓글과 다르다면
                        !(1 && 1) -> !(1) -> 0
                        만약 댓글의 깊이가 바로 밑이아니고 대댓글의 부모가 현재 댓글과 같다면
                        !(0 && 0) -> !(0) -> 1
                        만약 댓글의 깊이가 바로 밑이아니고 대댓글의 부모가 현재 댓글과 다르다면
                        !(0 && 1) -> !(0) -> 1
                        
                        밑의 코드로도 표현가능
                        if(child.depth!=depth){// 현재 깊이의 댓글이 아니고
                            if(child.depth==depth+1){// 만약 댓글의 깊이가 바로 밑이라면
                                if(child.parent_idx==e.comment_index){// 대댓글의 부모가 현재 댓글과 같다면
                                    childList.push(child);
                                }
                            }else{//아니면 바로 넣음
                                childList.push(child);
                            }
                        }
                        */
                        childList.push(child);
                    }
                });
                result.push({
                    idx:e.comment_index,
                    memberCode:e.member_code,
                    memberNickname:e.member_nickname,
                    memberLevel:e.member_level,
                    comment:e.comment,
                    commentDate:e.comment_date,
                    permission:e.permission,
                    child:commentTree(childList, depth+1, memberCode, memberLevel, isAnonymous)// 대댓글 재귀 호출
                })
            }else{
                result.push({
                    idx:e.comment_index,
                    memberCode:e.member_code,
                    memberNickname:e.member_nickname,
                    memberLevel:e.member_level,
                    comment:e.comment,
                    commentDate:e.comment_date,
                    permission:e.permission
                })
            }
        }
    });
    return result;
}
const write = (memberCode, boardType, commentBoardType, postNo, memberNickname, comment, depth, parentIdx) => {
    result=new Array()
    let commentCheckQuery
    let params
    if(depth<1){// 그냥 댓글
        commentCheckQuery="SELECT `post_no` FROM ?? WHERE `post_no`=?"
        params=[boardType, postNo]
    }else{// 대댓글
        commentCheckQuery="SELECT `parent` FROM ?? WHERE `post_no`=? AND `comment_index`=? AND `depth`=?"
        params=[commentBoardType, postNo, parentIdx, depth-1]
    }
    return new Promise(resolve => {
        conn.query(commentCheckQuery, params, (error, row) => {
            if(error) resolve({status:2,subStatus:0})
            if(row[0]==null){
                resolve({status:3,subStatus:0})
                return;
            }else{
                if(depth>0 && row[0].parent==0){// 대댓글이 있는지 표시
                    const commentParentQuery = "UPDATE ?? SET `parent`=1 WHERE `comment_index`=?"
                    const params=[commentBoardType, parentIdx]
                    conn.query(commentParentQuery, params, (error) => {
                        if(error) resolve({status:2,subStatus:0})
                    })
                }
            }
            const commentWriteQuery="INSERT INTO ?? (`post_no`, `depth`, `parent_idx`, `member_code`, `member_nickname`, `comment`, `comment_date`) VALUES (?, ?, ?, ?, ?, ?, now());"
            const params=[commentBoardType, postNo, depth, parentIdx, memberCode, memberNickname, comment]
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
const del = (memberCode, memberLevel, boardType, commentBoardType, postNo, commentIdx) => {
    result=new Array()
    const commentCheckQuery="SELECT `member_code` FROM ?? WHERE `comment_index`= ? AND `post_no`=?"
    const params=[commentBoardType, commentIdx, postNo]
    return new Promise(resolve => {
        conn.query(commentCheckQuery, params, (error, checkMemberCode) => {
            if(error) resolve({status:2,subStatus:0})
            if(checkMemberCode[0]==null){
                resolve({status:3,subStatus:0})
                return;
            }else{
                if(checkMemberCode[0].member_code==memberCode || memberLevel>=3){
                    const commentDeleteQuery="UPDATE ?? SET `comment_deleted` = 1 WHERE `comment_index`= ? AND `post_no`=?"
                    const params=[commentBoardType, commentIdx, postNo]
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
                    resolve({status:3,subStatus:7})
                }
            }
        })
    })
}

module.exports = {
    view:view,
    write:write,
    del:del,
}