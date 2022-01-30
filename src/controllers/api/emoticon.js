const jwt = require('../../jwt')
const model = require('../../models/emoticon')
const multer = require('multer')
const fs = require('fs');
const emoticon = require('../../models/emoticon');

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
    fileFilter:(req, file, cb) => {
        // 파일 확장자 체크
        const allowExt = [
            'png',
            'jpg',
            'gif',
            'webp'
        ]
        const ext = file.originalname.split('.')[file.originalname.split('.').length-1];
        // 이모티콘 썸네일은 png만 허용
        if(file.fieldname=='file'){
            if(ext != 'png') return cb(null, false);
        }
        if(allowExt.indexOf(ext)) return cb(null, false);
        cb(null, true)
    },
    storage:multer.diskStorage({
        destination:(req, file, cb) => {
            cb(null, 'public/resource/board/emoticon/temp')
        },
        filename:(req, file, cb) => {
            const name = file.originalname.split('.')[0];
            const ext = file.originalname.split('.')[file.originalname.split('.').length-1];
            file.name = name;
            file.ext = ext;
            if(file.fieldname=='file'){
                return cb(null, `icons/${name}.${ext}`)
            }
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
    if(req.files.files.length<4){res.send(JSON.stringify({status:3,subStatus:0}));return;}
    req.body.emoticons = JSON.parse(req.body.emoticons)
    if(req.files.files.length != (Object.keys(req.body.emoticons).length)){res.send(JSON.stringify({status:3,subStatus:0}));return;}
    let emoticonList = []
    for(let i=0;i<req.files.files.length;i++){
        const e = req.files.files[i];
        if(!req.body.emoticons[e.name]){res.send(JSON.stringify({status:3,subStatus:0}));return;}
        // 같은 확장자인지, 번호가 숫자가 맞는지 체크
        if(e.ext != req.body.emoticons[e.name].type || !(/^\d+$/.test(req.body.emoticons[e.name].idx))){
            res.send(JSON.stringify({status:3,subStatus:0}));
            return;
        }
        emoticonList.push({
            idx:req.body.emoticons[e.name].idx,
            type:req.body.emoticons[e.name].type
        });
    }

    // 이모티콘 정보 db에 저장
    dbResult = await model.uploadEmoticonInfo(req.body.name, req.body.description, jwtValue.memberCode)
    if(!dbResult){
        res.send(JSON.stringify({status:2,subStatus:0}));return;
    }else{
        req.body.id=dbResult;
    }
    // 폴더 생성
    try{
        await fs.promises.mkdir(`public/resource/board/emoticon/${req.body.id}`)
    }catch(err){
        console.error(err)
        res.send(JSON.stringify({status:2,subStatus:0}));return;
    }
    try{
        // 복사할 파일 리스트 생성
        let copyList = []
        copyList = req.files.files.map(e=>{
            return fs.promises.copyFile(e.path, `public/resource/board/emoticon/${req.body.id}/${req.body.emoticons[e.name].idx}.${req.body.emoticons[e.name].type}`)
        })
        copyList.push(fs.promises.copyFile(req.files.file[0].path, `public/resource/board/emoticon/${req.body.id}.png`))
        // 파일 복사 프로미스
        await Promise.all(copyList);
    }catch(err){
        console.error(err)
        res.send(JSON.stringify({status:2,subStatus:0}));return;
    }
    try{
        // 이모티콘들 db에 저장
        await model.uploadEmoticons(req.body.id, emoticonList);
    }catch(err){
        console.error(err)
        res.send(JSON.stringify({status:2,subStatus:0}));return;
    }
    res.send(JSON.stringify({status:1,subStatus:0}));return;
}

module.exports = {
    getemoticon:getemoticon,
    getemoticons:getemoticons,
    uploadProcessing:uploadProcessing,
    uploadCheck:uploadCheck
}