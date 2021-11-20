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
            commentBoardType='board_comment'
            isAnonymous=false
            break;
        case 'anonymous':
            commentBoardType='anonymous_comment'
            isAnonymous=true
            break
    }
    dbResult = await model.view(commentBoardType, req.params.postNo, isAnonymous)
    result={
        status:1,
        subStatus:0,
        arrComment:dbResult,
    }
    res.send(JSON.stringify(result))
}
const write = async (req, res) =>{
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
    result = await model.write(boardType, commentBoardType, req.params.postNo, req.session.memberCode, req.session.memberNickname, xss.process(req.body.comment))
    res.send(JSON.stringify(result))
}
const del = async (req, res) =>{
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
    result = await model.del(boardType, commentBoardType, req.params.postNo, req.session.memberCode, req.body.commentIndex)
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
    write:write,
    del:del,
}