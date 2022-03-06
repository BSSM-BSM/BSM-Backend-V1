const jwt = require('../../util/jwt')
let result, dbResult
let model = require('./board.service')
const view = async (req, res) =>{
    let boardType, isAnonymous, page, limit;
    const jwtValue = await jwt.check(req.cookies.token);
    switch(req.params.boardType){
        case 'board':
            if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
            boardType='board'
            isAnonymous=false
            break;
        case 'anonymous':
            boardType='anonymous'
            isAnonymous=true
            break;
        case 'notice':
            boardType='notice'
            isAnonymous=false
            break;
        default:
            res.send(JSON.stringify({status:3,subStatus:0}))
            return;
    }
    if(req.query.page>=1){
        page=parseInt(req.query.page);
    }else{
        page=1;
    }
    if(req.query.limit>=5){
        limit=parseInt(req.query.limit);
    }else{
        limit=15;
    }
    dbResult = await model.view(boardType, page, limit, isAnonymous)
    result={
        status:1,
        subStatus:0,
        arrBoard:dbResult.arrBoard,
        pages:dbResult.pages
    }
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
}