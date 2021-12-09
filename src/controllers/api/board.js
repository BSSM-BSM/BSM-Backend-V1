let result={
    status:2,
}
let dbResult={
    bool:false,
}
const view = async (req, res) =>{
    let model = require('../../models/board')
    let boardType, isAnonymous, page, limit;
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
        arrBoard:dbResult.arrBoard,
        pages:dbResult.pages
    }
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
}