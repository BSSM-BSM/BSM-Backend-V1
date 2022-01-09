const pool = require('../db')

let result
let likeQuery, likeParams, updateLikeQuery, updateLikeParams

const like = async (boardType, likeBoardType, postNo, memberCode, like) => {
    let likeCheck, postLike
    result=new Array()
    likeQuery="", updateLikeQuery=""
    if(like>0){
        like=1
    }else if(like<0){
        like=-1
    }else{
        like=0
    }
    const likeViewQuery="SELECT `like` FROM ?? WHERE `post_no`=?"
    const likeViewParams=[boardType, postNo]
    const likeCheckQuery="SELECT `like` FROM ?? WHERE `post_no`= ? AND `member_code`=?"
    try{
        [likeCheck] = await pool.query(likeCheckQuery, [likeBoardType, postNo, memberCode])
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    if(likeCheck.length){//대상 글에 좋아요 또는 싫어요를 누른 적이 있으면
        likeCheck=likeCheck[0].like
        likeQuery="UPDATE ?? SET `like`=? WHERE `post_no`=? AND `member_code`=?"
        likeParams=[likeBoardType, like, postNo, memberCode]
        if(likeCheck==like){//좋아요 또는 싫어요를 한번 더
            likeParams=[likeBoardType, 0, postNo, memberCode]//좋아요를 0으로
            returnLike=0
            if(like>0){//좋아요를 취소
                updateLikeQuery="UPDATE ?? SET `like`=`like`-1 WHERE `post_no`=?"
            }else{//싫어요를 취소
                updateLikeQuery="UPDATE ?? SET `like`=`like`+1 WHERE `post_no`=?"
            }
            updateLikeParams=[boardType, postNo]
        }else if(likeCheck==0){//취소한 좋아요 또는 싫어요를 다시 누름
            returnLike=like
            updateLikeQuery="UPDATE ?? SET `like`=`like`+? WHERE `post_no`=?"
            updateLikeParams=[boardType, like, postNo]
        }else{//좋아요에서 싫어요 또는 싫어요에서 좋아요
            if(likeCheck>0){//좋아요에서 싫어요
                returnLike=-1
                updateLikeQuery="UPDATE ?? SET `like`=`like`-2 WHERE `post_no`=?"
            }else{//싫어요에서 좋야요
                returnLike=1
                updateLikeQuery="UPDATE ?? SET `like`=`like`+2 WHERE `post_no`=?"
            }
            updateLikeParams=[boardType, postNo]
        }
    }else{//대상 글에 좋아요 또는 싫어요를 한번도 누른 적이 없으면
        likeQuery="INSERT INTO ?? (`post_no`, `like`, `member_code`) values (?, ?, ?)"
        likeParams=[likeBoardType, postNo, like, memberCode]
        updateLikeQuery = "UPDATE ?? SET `like`=`like`+? WHERE `post_no`=?"
        updateLikeParams=[boardType, like, postNo]
        returnLike=like
    }
    try{
        pool.query(updateLikeQuery, updateLikeParams)
        await pool.query(likeQuery, likeParams)
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    try{
        [postLike] = await pool.query(likeViewQuery, likeViewParams)
    }catch(err){
        console.error(err)
        return {status:2,subStatus:0};
    }
    postLike=postLike[0].like
    result={
        status:1,
        subStatus:0,
        like:returnLike,
        postLike:postLike,
    };
    return result
}

module.exports = {
    like:like,
}