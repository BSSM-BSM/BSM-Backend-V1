const service = require('./post.service')
const jwt = require('../../util/jwt')
const webpush = require('../../util/push')
const js_xss = require('xss')
const xss = new js_xss.FilterXSS({
    onIgnoreTagAttr:(tag, name, value, isWhiteAttr) => {
        if(name.substr(0, 5) === "style") {
            return name + '="' + js_xss.escapeAttrValue(value) + '"';
        }
        if(tag.substr(0, 3)==="img"){
            if(name.substr(0, 4) === "e_id") {
                return name + '="' + js_xss.escapeAttrValue(value) + '"';
            }
            if(name.substr(0, 5) === "e_idx") {
                return name + '="' + js_xss.escapeAttrValue(value) + '"';
            }
            if(name.substr(0, 6) === "e_type") {
                return name + '="' + js_xss.escapeAttrValue(value) + '"';
            }
        }
    },
    onIgnoreTag:(tag, html, options) => {
        if(tag.substr(0, 6) === "iframe") {
            return html;
        }
    }
});

let result={
    status:2,
}
const view = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    let boardType, isAnonymous;
    switch(req.params.boardType){
        case 'board':
            if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
            boardType='board'
            likeBoardType='board_like'
            isAnonymous=false
            break;
        case 'anonymous':
            boardType='anonymous'
            likeBoardType='anonymous_like'
            isAnonymous=true
            break;
        case 'notice':
            boardType='notice'
            likeBoardType='notice_like'
            isAnonymous=false
            break;
        default:
            res.send(JSON.stringify({status:3,subStatus:0}))
            return;
    }
    result = await service.view(jwtValue.memberCode, jwtValue.memberLevel, boardType, likeBoardType, req.params.postNo, isAnonymous)
    res.send(JSON.stringify(result))
}
const write = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break;
        case 'notice':
            if(jwtValue.memberLevel<3){res.send(JSON.stringify({status:3,subStatus:1}));return;}
            boardType='notice'
            const payload = JSON.stringify({
                title:"새로운 공지사항이 있습니다",
                body:req.body.postTitle,
                link:"/board/notice"
            })
            webpush.push(payload, 'all');
            break;
    }
    result = await service.write(jwtValue.memberCode, jwtValue.memberNickname, boardType, xss.process(req.body.postTitle), xss.process(req.body.postContent))
    res.send(JSON.stringify(result))
}
const update = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break;
        case 'notice':
            if(jwtValue.memberLevel<3){res.send(JSON.stringify({status:3,subStatus:1}));return;}
            boardType='notice'
            break;
    }
    result = await service.update(jwtValue.memberCode, jwtValue.memberLevel, boardType, req.params.postNo, xss.process(req.body.postTitle), xss.process(req.body.postContent))
    res.send(JSON.stringify(result))
}
const del = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break;
        case 'notice':
            if(jwtValue.memberLevel<3){res.send(JSON.stringify({status:3,subStatus:1}));return;}
            boardType='notice'
            break;
    }
    result = await service.del(jwtValue.memberCode, jwtValue.memberLevel, boardType, req.params.postNo)
    res.send(JSON.stringify(result))
}

module.exports = {
    view:view,
    write:write,
    update:update,
    del:del,
}