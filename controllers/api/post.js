let result={
    status:2,
}
let dbResult={
    bool:false,
}
let view = async (req, res) =>{
    let model = require('../../models/post')
    let boardType;
    switch(req.body.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break
    }
    dbResult = await model.view(req.body.boardType, req.body.postNo)
    result={
        status:1,
        arrBoard:dbResult,
    }
    res.send(JSON.stringify(dbResult))
}
let write = (req, res) =>{
    res.send()
}

module.exports = {
    view:view,
    write:write,
}