const pool = require('../db')

let result=new Array()

const view = async (memberCode, memberLevel, boardType, likeBoardType, postNo, isAnonymous) => {
    let rows
    result=new Array()
    const postQuery="SELECT * FROM ?? WHERE `post_no`=?"
    try{
        [rows] = await pool.query(postQuery, [boardType, postNo])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    if(!rows.length) return {status:3,subStatus:6}
    rows=rows[0]
    if(rows.post_deleted) return {status:3,subStatus:6}
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
    try{
        [rows] = await pool.query(likeCheckQuery, [likeBoardType, postNo, memberCode])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    if(rows.length){
        result['like']=rows[0].like
    }else{
        result['like']=0
    }
    const postHitQuery="UPDATE ?? SET `post_hit`=`post_hit`+1 WHERE `post_no`=?"
    try{
        await pool.query(postHitQuery, [boardType, postNo])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    return result
}
const write = async (memberCode, memberNickname, boardType, postTitle, postContent) => {
	const postQuery="INSERT INTO ?? (member_code, member_nickname, post_title, post_content, post_date) values(?, ?, ?, ?, now())"
    try{
        await pool.query(postQuery, [boardType, memberCode, memberNickname, postTitle, postContent])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    return {status:1,subStatus:0}
}
const update = async (memberCode, memberLevel, boardType, postNo, postTitle, postContent) => {
    let rows
    result=new Array()
    const postCheckQuery="SELECT `member_code` FROM ?? WHERE `post_no`=?"
    try{
        [rows] = await pool.query(postCheckQuery, [boardType, postNo])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    if(rows[0]==null){
        return {status:3,subStatus:6}
    }
    if(!(rows[0].member_code==memberCode || memberLevel>=3)){
        return {status:3,subStatus:7}
    }
    const postUpdateQuery="UPDATE ?? SET `post_title`=?, `post_content`=? WHERE `post_no`=?"
    try{
        await pool.query(postUpdateQuery, [boardType, postTitle, postContent, postNo])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    return {status:1,subStatus:0}
}
const del = async (memberCode, memberLevel, boardType, postNo) => {
    let rows
    result=new Array()
    const postCheckQuery="SELECT `member_code` FROM ?? WHERE `post_no`=?"
    try{
        [rows] = await pool.query(postCheckQuery, [boardType, postNo])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    if(rows[0]==null){
        return {status:3,subStatus:6}
    }
    if(!(rows[0].member_code==memberCode || memberLevel>=3)){
        return {status:3,subStatus:7}
    }
    const postDeleteQuery="UPDATE ?? SET `post_deleted`=1 WHERE `post_no`=?"
    try{
        await pool.query(postDeleteQuery, [boardType, postNo])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    return {status:1,subStatus:0}
}

module.exports = {
    view:view,
    write:write,
    update,update,
    del:del,
}