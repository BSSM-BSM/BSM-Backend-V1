const pool = require('../../util/db')


let result=new Object();

const view = async (boardType, page, limit, isAnonymous) => {
    let rows
    // 총 게시물 갯수
    const totalPostQuery="SELECT COUNT(`post_no`) FROM ?? WHERE `post_deleted`=0"
    try{
        [rows] = await pool.query(totalPostQuery, [boardType])
    }catch(err){
        console.error(err)
        return null;
    }
    result=new Object();
    // 게시판 페이지 수 계산
    let totalPage, startPost, limitPost=limit;
    startPost = (page-1)*limitPost;
    totalPage=Math.ceil(rows[0]["COUNT(`post_no`)"]/limitPost);
    result.pages=totalPage;

    const boardQuery="SELECT `post_no`, `post_title`, `post_comments`, `member_code`, `member_nickname`, `post_date`, `post_hit`, `like` FROM ?? WHERE `post_deleted`=0 ORDER BY `post_no` DESC LIMIT ?, ?"
    try{
        [rows] = await pool.query(boardQuery, [boardType, startPost, limitPost])
    }catch(err){
        console.error(err)
        return null;
    }
    let n = rows.length;
    if(!n) result.arrBoard=null;
    else{
        result.arrBoard=new Array()
        for(let i=0;i<n;i++){
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
    return result
}

module.exports = {
    view:view,
}