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
    result = await model.write(boardType, req.session.memberCode, req.session.memberNickname, req.body.postTitle, req.body.postContent)
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