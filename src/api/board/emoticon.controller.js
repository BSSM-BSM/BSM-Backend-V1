const jwt = require('../../util/jwt');
const service = require('./emoticon.service');
const multer = require('multer');

const getemoticon = async (req, res, next) => {
    try{
        res.send(JSON.stringify(
            await service.getemoticon(req.params.id)
        ));
    }catch(err){
        next(err);
    }
}

const getemoticons = async (req, res, next) => {
    try{
        res.send(JSON.stringify(
            await service.getemoticons()
        ));
    }catch(err){
        next(err);
    }
}

const uploadProcessing = multer({
    fileFilter:(req, file, cb) => {
        // 파일 확장자 체크
        const allowExt = [
            'png',
            'jpg',
            'jpeg',
            'gif',
            'webp'
        ]
        const ext = file.originalname.split('.')[file.originalname.split('.').length-1];
        // 이모티콘 썸네일은 png만 허용
        if(file.fieldname=='file'){
            if(ext != 'png') return cb(null, false);
        }
        if(allowExt.indexOf(ext)==-1) return cb(null, false);
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
const uploadEmoticon = async (req, res, next) => {
    const jwtValue = jwt.check(req.cookies.token);
    try{
        res.send(JSON.stringify(
            await service.uploadEmoticon(
                jwtValue.isLogin? jwtValue.memberCode: null,
                req.body.name,
                req.body.description,
                JSON.parse(req.body.emoticons),
                req.files
            )
        ));
    }catch(err){
        next(err);
    }
}

module.exports = {
    getemoticon,
    getemoticons,
    uploadProcessing,
    uploadEmoticon
}