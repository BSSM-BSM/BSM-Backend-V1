import express from "express";
const router = express.Router();
import * as service from './post.service';
import * as jwt from '../../util/jwt';
import { User } from "../account/User";
import multer from "multer";
import loginCheck from "../../util/loginCheck";

router.get('/post/:boardType/:postNo', async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token));
    try {
        res.send(JSON.stringify(
            await service.viewPost(
                user,
                req.params.boardType,
                Number(req.params.postNo),
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/post/:boardType', 
    loginCheck,
    async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const user = new User(jwt.verify(req.cookies.token));
        try {
            res.send(JSON.stringify(
                await service.writePost(
                    user,
                    req.params.boardType,
                    req.body.title,
                    req.body.content
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
        const user = new User(jwt.verify(req.cookies.token));
        try {
            res.send(JSON.stringify(
                await service.updatePost(
                    user,
                    req.params.boardType,
                    Number(req.params.postNo),
                    req.body.title,
                    req.body.content
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
        const user = new User(jwt.verify(req.cookies.token));
        try {
            res.send(JSON.stringify(
                await service.deletePost(
                    user,
                    req.params.boardType,
                    Number(req.params.postNo)
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
            res.send(JSON.stringify({filePath: `/resource/board/upload/${req.file?.filename}`}));
        } catch(err) {
            next(err);
        }
    }
)

export = router;