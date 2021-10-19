let result={
    status:2,
}
let dbResult={
    bool:false,
}
let view = async (req, res) =>{
    let model = require('../../models/board')
    let boardType;
    switch(req.body.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break
    }
    dbResult = await model.view(req.body.boardType)
    result={
        status:1,
        arrBoard:dbResult,
    }
    res.send(JSON.stringify(result))
}
let write = (req, res) =>{
    res.send()
}

module.exports = {
    view:view,
    write:write,
}