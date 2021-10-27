let result={
    status:2,
}
let dbResult={
    bool:false,
}
const view = async (req, res) =>{
    let model = require('../../models/comment')
    let commentBoardType;
    switch(req.params.boardType){
        case 'board':
            commentBoardType='board_comment'
            break;
        case 'anonymous':
            commentBoardType='anonymous_comment'
            break
    }
    dbResult = await model.view(commentBoardType, req.params.postNo)
    result={
        status:1,
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
    dbResult = await model.write(boardType, commentBoardType, req.params.postNo, req.session.memberCode, req.session.memberNickname, req.body.comment)
    result={
        status:dbResult
    }
    res.send(JSON.stringify(result))
}
const del = (req, res) =>{
    res.send()
}

module.exports = {
    view:view,
    write:write,
    del:del,
}