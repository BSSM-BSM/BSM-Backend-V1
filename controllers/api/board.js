let result={
    status:2,
}
let dbResult={
    bool:false,
}
const view = async (req, res) =>{
    let model = require('../../models/board')
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break
    }
    dbResult = await model.view(boardType)
    result={
        status:1,
        arrBoard:dbResult,
    }
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
}