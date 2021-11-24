const js_xss = require('xss')
const xss = new js_xss.FilterXSS({
    whiteList: {},
})
let result
let dbResult={
    bool:false,
}
const view = async (req, res) =>{
    let model = require('../../models/comment')
    let commentBoardType, isAnonymous;
    switch(req.params.boardType){
        case 'board':
            if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
            commentBoardType='board_comment'
            isAnonymous=false
            break;
        case 'anonymous':
            commentBoardType='anonymous_comment'
            isAnonymous=true
            break;
        default:
            res.send(JSON.stringify({status:3,subStatus:0}))
            return;
    }
    dbResult = await model.view(req.session.memberCode, req.session.memberLevel, commentBoardType, req.params.postNo, isAnonymous)
    result={
        status:1,
        subStatus:0,
        arrComment:dbResult,
    }
    res.send(JSON.stringify(result))
}
const write = async (req, res) =>{
    if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
    let model = require('../../models/comment')
    let boardType, commentBoardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            commentBoardType='board_comment'
            break;
        case 'anonymous':
            boardType='anonymous'
            commentBoardType='anonymous_comment'
            break
    }
    result = await model.write(req.session.memberCode, boardType, commentBoardType, req.params.postNo, req.session.memberNickname, xss.process(req.body.comment))
    res.send(JSON.stringify(result))
}
const del = async (req, res) =>{
    if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
    let model = require('../../models/comment')
    let boardType, commentBoardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            commentBoardType='board_comment'
            break;
        case 'anonymous':
            boardType='anonymous'
            commentBoardType='anonymous_comment'
            break
    }
    result = await model.del(req.session.memberCode, req.session.memberLevel, boardType, commentBoardType, req.params.postNo, req.body.commentIndex)
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
    write:write,
    del:del,
}