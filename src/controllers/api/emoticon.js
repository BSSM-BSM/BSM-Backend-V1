const jwt = require('../../jwt')
const model = require('../../models/emoticon')
const multer = require('multer')

let result, dbResult;
const getemoticon = async (req, res) => {
    dbResult = await model.getemoticon(req.params.id)
    result = {
        status:1,
        subStatus:0,
        emoticon:dbResult
    }
    res.send(JSON.stringify(result))
}
const getemoticons = async (req, res) => {
    dbResult = await model.getemoticons()
    result = {
        status:1,
        subStatus:0,
        emoticon:dbResult
    }
    res.send(JSON.stringify(result))
}
const uploadProcessing = multer({
    storage:multer.diskStorage({
        destination:(req, file, cb) => {
            cb(null, 'public/resource/board/emoticon/temp')
        },
        filename:(req, file, cb) => {
            const name = file.originalname.split('.')[0];
            const ext = file.originalname.split('.')[file.originalname.split('.').length-1];
            file.name = name;
            file.ext = ext;
            cb(null, `${name}.${ext}`)
        }
    })
})
const uploadCheck = async (req, res) => {
    const jwtValue = jwt.check(req.cookies.token);
    if(!jwtValue.isLogin){res.send(JSON.stringify(jwtValue.msg));return;}

    // 업로드 데이터 체크
    if(!req.body.name || !req.body.description || !req.files.file || !req.files.files || !req.body.emoticons){res.send(JSON.stringify({status:3,subStatus:0}));return;}
    if(req.body.name.length<2){res.send(JSON.stringify({status:3,subStatus:0}));return;}
    if(req.body.description.length<2){res.send(JSON.stringify({status:3,subStatus:0}));return;}
    if(req.files.length<2){res.send(JSON.stringify({status:3,subStatus:0}));return;}
    req.body.emoticons = JSON.parse(req.body.emoticons)
    if(req.files.files.length != (Object.keys(req.body.emoticons).length)){res.send(JSON.stringify({status:3,subStatus:0}));return;}
    for(let i=0;i<req.files.files.length;i++){
        const e = req.files.files[i];
        if(!req.body.emoticons[e.name]){res.send(JSON.stringify({status:3,subStatus:0}));return;}
        if(e.ext != req.body.emoticons[e.name].type){
            res.send(JSON.stringify({status:3,subStatus:0}));
            return;
        }
    }
    res.send(JSON.stringify({status:1,subStatus:0}));return;
    // dbResult = await model.uploadEmoticonInfo(req.body.name, req.body.description, jwtValue.memberCode)
    // if(!dbResult){
    //     res.send(JSON.stringify({status:2,subStatus:0}));return;
    // }else{
    //     req.body.id=dbResult;
    //     next();
    // }
}

module.exports = {
    getemoticon:getemoticon,
    getemoticons:getemoticons,
    uploadProcessing:uploadProcessing,
    uploadCheck:uploadCheck
}