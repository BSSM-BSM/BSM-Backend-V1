const conn = require('../db')

let result
let likeQuery, updateLikeQuery, likeViewQuery

const like = (boardType, likeBoardType, postNo, memberCode, like) => {
    result=new Array()
    likeQuery="", updateLikeQuery="", likeViewQuery = "SELECT `like` FROM `"+boardType+"` WHERE `post_no`= "+postNo
    if(like>0){
        like=1
    }else if(like<0){
        like=-1
    }else{
        like=0
    }
    let likeCheckQuery="SELECT `like` FROM `"+likeBoardType+"` WHERE `post_no`= "+postNo+" AND `member_code`="+memberCode
    return new Promise(resolve => {
        conn.query(likeCheckQuery, (error, likeCheck) => {
            if(error) resolve(error)
            if(Object.keys(likeCheck).length){//대상 글에 좋아요 또는 싫어요를 누른 적이 있으면
                likeCheck=likeCheck[0].like
                likeQuery = "UPDATE `"+likeBoardType+"` SET `like`="+like+" WHERE `post_no`="+postNo+" AND `member_code`="+memberCode
                if(likeCheck==like){//좋아요 또는 싫어요를 한번 더
                    likeQuery = "UPDATE `"+likeBoardType+"` SET `like`=0 WHERE `post_no`="+postNo+" AND `member_code`="+memberCode
                    returnLike=0
                    if(like>0){//좋아요를 취소
                        updateLikeQuery = "UPDATE `"+boardType+"` SET `like`=`like`-1 WHERE `post_no`="+postNo
                    }else{//싫어요를 취소
                        updateLikeQuery = "UPDATE `"+boardType+"` SET `like`=`like`+1 WHERE `post_no`="+postNo
                    }
                }else if(likeCheck==0){//취소한 좋아요 또는 싫어요를 다시 누름
                    returnLike=like
                    updateLikeQuery = "UPDATE `"+boardType+"` SET `like`=`like`+"+like+" WHERE `post_no`="+postNo
                }else{//좋아요에서 싫어요 또는 싫어요에서 좋아요
                    if(likeCheck>0){//좋아요에서 싫어요
                        returnLike=-1
                        updateLikeQuery = "UPDATE `"+boardType+"` SET `like`=`like`-2 WHERE `post_no`="+postNo
                    }else{//싫어요에서 좋야요
                        returnLike=1
                        updateLikeQuery = "UPDATE `"+boardType+"` SET `like`=`like`+2 WHERE `post_no`="+postNo
                    }
                }
            }else{//대상 글에 좋아요 또는 싫어요를 한번도 누른 적이 없으면
                likeQuery = "INSERT INTO `"+likeBoardType+"` (`post_no`, `like`, `member_code`) values ("+postNo+", "+like+", "+memberCode+")"
                updateLikeQuery = "UPDATE `"+boardType+"` SET `like`=`like`+"+like+" WHERE `post_no`="+postNo
                returnLike=like
            }
            conn.query(likeQuery, (error) => {
                if(error) resolve(error)
                conn.query(updateLikeQuery, (error) => {
                    if(error) resolve(error)
                    conn.query(likeViewQuery, (error, postLike) => {
                        if(error) resolve(error)
                        postLike=postLike[0].like
                        result={
                            status:1,
                            like:returnLike,
                            postLike:postLike,
                        };
                        resolve(result)
                    })
                })
            })
        })
    })
}

module.exports = {
    like:like,
}