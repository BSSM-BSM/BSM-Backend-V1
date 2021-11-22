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
            if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
            boardType='board'
            isAnonymous=false
            break;
        case 'anonymous':
            boardType='anonymous'
            isAnonymous=true
            break;
        default:
            res.send(JSON.stringify({status:3,subStatus:0}))
            return;
            
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