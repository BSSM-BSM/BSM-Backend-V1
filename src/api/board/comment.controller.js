const service = require('./comment.service')
const jwt = require('../../util/jwt')
const js_xss = require('xss')
const xss = new js_xss.FilterXSS({
    whiteList: {
        img: ["e_id", "e_idx", "e_type"]
    },
})
let result
let dbResult
const view = async (req, res) =>{
    let commentBoardType, isAnonymous;
    const jwtValue = await jwt.check(req.cookies.token);
    switch(req.params.boardType){
        case 'board':
            if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
            commentBoardType='board_comment'
            isAnonymous=false
            break;
        case 'anonymous':
            commentBoardType='anonymous_comment'
            isAnonymous=true
            break;
        case 'notice':
            commentBoardType='notice_comment'
            isAnonymous=false
            break;
        default:
            res.send(JSON.stringify({status:3,subStatus:0}))
            return;
    }
    dbResult = await service.view(jwtValue.memberCode, jwtValue.memberLevel, commentBoardType, req.params.postNo, isAnonymous)
    result={
        status:1,
        subStatus:0,
        arrComment:dbResult,
    }
    res.send(JSON.stringify(result))
}
const write = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    let boardType, commentBoardType, depth, parentIdx;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            commentBoardType='board_comment'
            break;
        case 'anonymous':
            boardType='anonymous'
            commentBoardType='anonymous_comment'
            break;
        case 'notice':
            boardType='notice'
            commentBoardType='notice_comment'
            break;
        default:
            break;
    }
    if(req.body.comment==undefined || req.body.comment.length<1){res.send(JSON.stringify({status:3,subStatus:0}));return;}
    if(req.params.depth>0){
        depth=parseInt(req.params.depth);
    }else{
        depth=0;
    }
    if(req.params.parentIdx>0){
        parentIdx=parseInt(req.params.parentIdx);
    }else{
        parentIdx=null;
    }
    result = await service.write(jwtValue.memberCode, boardType, commentBoardType, req.params.postNo, jwtValue.memberNickname, xss.process(req.body.comment), depth, parentIdx)
    res.send(JSON.stringify(result))
}
const del = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    let boardType, commentBoardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            commentBoardType='board_comment'
            break;
        case 'anonymous':
            boardType='anonymous'
            commentBoardType='anonymous_comment'
            break;
        case 'notice':
            boardType='notice'
            commentBoardType='notice_comment'
            break;
    }
    result = await service.del(jwtValue.memberCode, jwtValue.memberLevel, boardType, commentBoardType, req.params.postNo, req.params.commentIdx)
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
    write:write,
    del:del,
}