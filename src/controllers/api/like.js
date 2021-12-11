let result
const like = async (req, res) =>{
    if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
    let model = require('../../models/like')
    let boardType, likeBoardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            likeBoardType='board_like'
            break;
        case 'anonymous':
            boardType='anonymous'
            likeBoardType='anonymous_like'
            break;
        case 'notice':
            boardType='notice'
            likeBoardType='notice_like'
            break;
    }
    result = await model.like(boardType, likeBoardType, req.params.postNo, req.session.memberCode, req.body.like)
    res.send(JSON.stringify(result))
}

module.exports = {
    like:like,
}