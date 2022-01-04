const jwt = require('../../jwt')
let result
const like = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
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
    result = await model.like(boardType, likeBoardType, req.params.postNo, jwtValue.memberCode, req.body.like)
    res.send(JSON.stringify(result))
}

module.exports = {
    like:like,
}