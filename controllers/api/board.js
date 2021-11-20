let result={
    status:2,
}
let dbResult={
    bool:false,
}
const view = async (req, res) =>{
    let model = require('../../models/board')
    let boardType, isAnonymous;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            isAnonymous=false
            break;
        case 'anonymous':
            boardType='anonymous'
            isAnonymous=true
            break
    }
    dbResult = await model.view(boardType, isAnonymous)
    result={
        status:1,
        arrBoard:dbResult,
    }
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
}