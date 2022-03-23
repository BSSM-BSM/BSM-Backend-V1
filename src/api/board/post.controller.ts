import express from "express";
const router = express.Router();
const service = require('./post.service');
const jwt = require('../../util/jwt');
import multer from "multer";
import loginCheck from "../../util/loginCheck";

router.get('/post/:boardType/:postNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const jwtValue = await jwt.check(req.cookies.token);
    try {
        res.send(JSON.stringify(
            await service.viewPost(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                req.params.boardType,
                req.params.postNo,
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/post/:boardType', 
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const jwtValue = await jwt.check(req.cookies.token);
        try {
            res.send(JSON.stringify(
                await service.writePost(
                    jwtValue.isLogin? jwtValue.memberCode: null,
                    jwtValue.isLogin? jwtValue.memberLevel: null,
                    jwtValue.memberNickname,
                    req.params.boardType,
                    req.body.postTitle,
                    req.body.postContent
                )
            ));
        } catch(err) {
            next(err);
        }
    }
)

router.put('/post/:boardType/:postNo', 
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const jwtValue = await jwt.check(req.cookies.token);
        try {
            res.send(JSON.stringify(
                await service.updatePost(
                    jwtValue.isLogin? jwtValue.memberCode: null,
                    jwtValue.isLogin? jwtValue.memberLevel: null,
                    req.params.boardType,
                    req.params.postNo,
                    req.body.postTitle,
                    req.body.postContent
                )
            ));
        } catch(err) {
            next(err);
        }
    }
)

router.delete('/post/:boardType/:postNo', 
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const jwtValue = await jwt.check(req.cookies.token);
        try {
            res.send(JSON.stringify(
                await service.deletePost(
                    jwtValue.isLogin? jwtValue.memberCode: null,
                    jwtValue.isLogin? jwtValue.memberLevel: null,
                    req.params.boardType,
                    req.params.postNo
                )
            ));
        } catch(err) {
            next(err);
        }
    }
)

const uploadProcessing = multer({
    storage:multer.diskStorage({
        destination:(req, file, cb) => {
            cb(null, 'public/resource/board/upload/');
        },
        filename:(req, file, cb) => {
            cb(null, Date.now()+'.'+file.originalname.split('.')[file.originalname.split('.').length-1]);
        }
    })
})

router.post('/imageUpload',
    loginCheck,
    uploadProcessing.single('file'),
    (req:express.Request, res:express.Response, next:express.NextFunction) => {
        try {
            res.send(JSON.stringify({
                    filePath: `/resource/board/upload/${req.file?.filename}`
                }
            ));
        } catch(err) {
            next(err);
        }
    }
)

export = router;