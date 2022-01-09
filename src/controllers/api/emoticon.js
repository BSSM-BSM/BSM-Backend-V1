const jwt = require('../../jwt')
const model = require('../../models/emoticon')

let result, dbResult;
const getemoticon = async (req, res) => {
    const jwtValue = jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    dbResult = await model.getemoticon(req.params.id)
    result = {
        status:1,
        subStatus:0,
        emoticon:dbResult
    }
    res.send(JSON.stringify(result))
}
const getemoticons = async (req, res) => {
    const jwtValue = jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    dbResult = await model.getemoticons()
    result = {
        status:1,
        subStatus:0,
        emoticon:dbResult
    }
    res.send(JSON.stringify(result))
}

module.exports = {
    getemoticon:getemoticon,
    getemoticons:getemoticons
}