const js_xss = require('xss')
const xss = new js_xss.FilterXSS({
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        if (name.substr(0, 5) === "style") {
            return name + '="' + js_xss.escapeAttrValue(value) + '"';
        }
    },
});

let result={
    status:2,
}
const view = async (req, res) =>{
    let model = require('../../models/post')
    let boardType, isAnonymous;
    switch(req.params.boardType){
        case 'board':
            if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
            boardType='board'
            likeBoardType='board_like'
            isAnonymous=false
            break;
        case 'anonymous':
            boardType='anonymous'
            likeBoardType='anonymous_like'
            isAnonymous=true
            break;
        default:
            res.send(JSON.stringify({status:3,subStatus:0}))
            return;
    }
    result = await model.view(req.session.memberCode, req.session.memberLevel, boardType, likeBoardType, req.params.postNo, isAnonymous)
    res.send(JSON.stringify(result))
}
const write = async (req, res) =>{
    if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
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
    result = await model.write(req.session.memberCode, req.session.memberNickname, boardType, xss.process(req.body.postTitle), xss.process(req.body.postContent))
    res.send(JSON.stringify(result))
}
const update = async (req, res) =>{
    if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
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
    result = await model.update(req.session.memberCode, req.session.memberLevel, boardType, req.params.postNo, xss.process(req.body.postTitle), xss.process(req.body.postContent))
    res.send(JSON.stringify(result))
}
const del = async (req, res) =>{
    if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
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
    result = await model.del(req.session.memberCode, req.session.memberLevel, boardType, req.params.postNo)
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
    write:write,
    update:update,
    del:del,
}