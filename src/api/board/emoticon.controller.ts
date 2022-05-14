import express from 'express';
const router = express.Router();
import { BadRequestException } from '@src/util/exceptions';
import * as service from '@src/api/board/emoticon.service';
import * as jwt from '@src/util/jwt';
import { User } from '@src/api/account/User';
import multer from 'multer';

router.get('/:id', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getemoticon(Number(req.params.id))
        ));
    } catch(err) {
        next(err);
    }
})

router.get('/', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.getemoticons()
        ));
    } catch(err) {
        next(err);
    }
})

const uploadProcessing = multer({
    fileFilter:(req, file: Express.Multer.File, cb) => {
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
        if (file.fieldname=='file') {
            if (ext != 'png') return cb(null, false);
        }
        if (allowExt.indexOf(ext)==-1) return cb(null, false);
        cb(null, true)
    },
    storage:multer.diskStorage({
        destination:(req, file, cb) => {
            cb(null, 'public/resource/board/emoticon/temp')
        },
        filename:(req, file, cb) => {
            const name = file.originalname.split('.')[0];
            const ext = file.originalname.split('.')[file.originalname.split('.').length-1];
            if (file.fieldname=='file') {
                return cb(null, `icons/${name}.${ext}`)
            }
            cb(null, `${name}.${ext}`)
        }
    })
})

const uploadEmoticon = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token).value);
    try {
        if (req.files === undefined) {
            throw new BadRequestException();
        }
        const files = req.files as {[fieldname: string]: Express.Multer.File[]};
        if (files['files'].length < 4 || files['file'].length != 1) {
            throw new BadRequestException();
        }
        res.send(JSON.stringify(
            await service.uploadEmoticon(
                user,
                req.body.name,
                req.body.description,
                JSON.parse(req.body.emoticons),
                files['files'],
                files['file'][0]
            )
        ));
    } catch(err) {
        next(err);
    }
}

router.post('/',
    uploadProcessing.fields([{name:'file'},{name:'files'}]),
    uploadEmoticon
);

export = router