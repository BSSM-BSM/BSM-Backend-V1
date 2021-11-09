let result={
    status:2,
}
const view = async (req, res) =>{
    let model = require('../../models/post')
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break
    }
    result = await model.view(boardType, req.params.postNo)
    res.send(JSON.stringify(result))
}
const write = async (req, res) =>{
    let model = require('../../models/post')
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break
    }
    result = await model.write(req.session.memberCode, req.session.memberNickname, boardType, req.body.postTitle, req.body.postContent)
    res.send(JSON.stringify(result))
}
const update = async (req, res) =>{
    let model = require('../../models/post')
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break
    }
    result = await model.update(req.session.memberCode, boardType, req.params.postNo, req.body.postTitle, req.body.postContent)
    res.send(JSON.stringify(result))
}
const del = async (req, res) =>{
    let model = require('../../models/post')
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break
    }
    result = await model.del(req.session.memberCode, boardType, req.params.postNo)
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
    write:write,
    update:update,
    del:del,
}