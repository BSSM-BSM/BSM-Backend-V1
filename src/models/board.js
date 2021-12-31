const conn = require('../db')
const getMembersLevel = require('./membersLevel')


let result=new Object();

const view = async (boardType, page, limit, isAnonymous) => {
    let membersLevel = await getMembersLevel.get()
    return new Promise(resolve => {
        // 총 게시물 갯수
        const totalPostQuery="SELECT COUNT(`post_no`) FROM ?? WHERE `post_deleted`=0"
        const params=[boardType]
        conn.query(totalPostQuery, params, (error, total) => {
            if(error) resolve(error)
            result=new Object();
            // 게시판 페이지 수 계산
            let totalPage, startPost, limitPost=limit;
            startPost = (page-1)*limitPost;
            totalPage=Math.ceil(total[0]["COUNT(`post_no`)"]/limitPost);
            result.pages=totalPage;
            const boardQuery="SELECT `post_no`, `post_title`, `post_comments`, `member_code`, `member_nickname`, `post_date`, `post_hit`, `like` FROM ?? WHERE `post_deleted`=0 ORDER BY `post_no` DESC LIMIT ?, ?"
            const params=[boardType, startPost, limitPost];
            conn.query(boardQuery, params, (error, rows) => {
                if(error) result.arrBoard=null;
                let n = rows.length;
                if(!n) result.arrBoard=null;
                else{
                    result.arrBoard=new Array()
                    for(let i=0;i<n;i++){
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
                        result.arrBoard[i]={
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
                }
                resolve(result)
            })
        })
    })
}

module.exports = {
    view:view,
}