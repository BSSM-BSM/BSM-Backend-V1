import express from 'express';
import { InternalServerException } from '../../util/exceptions';
import * as jwt from '../../util/jwt';
import * as service from './account.service';
import { User } from './User';
import loginCheck from '../../util/loginCheck';

const router = express.Router();
import multer from 'multer';

router.post('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.login(res, req.body.id, req.body.pw)
        ));
    } catch(err) {
        next(err);
    }
})

router.delete('/logout', (req: express.Request, res: express.Response) => {
    res.clearCookie('token', {
        domain:'bssm.kro.kr',
        path:'/',
    });
    res.clearCookie('refreshToken', {
        domain:'bssm.kro.kr',
        path:'/',
    });
    res.clearCookie('token', {
        domain:'.bssm.kro.kr',
        path:'/',
    });
    res.clearCookie('refreshToken', {
        domain:'.bssm.kro.kr',
        path:'/',
    });
    res.send();
})

router.get('/islogin', (req: express.Request, res: express.Response) => {
    const user = new User(jwt.verify(req.cookies.token));
    if (user.getIsLogin()) {
        res.send({islogin:true});
    } else {
        res.send({islogin:false});
    }
})

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.signUp(
                req.body.id,
                req.body.pw,
                req.body.pw_check,
                req.body.nickname,
                req.body.authcode
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.get('/:usercode',
    loginCheck,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user = new User(jwt.verify(req.cookies.token));
        try {
            res.send(JSON.stringify(
                await service.viewUser(user, Number(req.params.usercode))
            ));
        } catch(err) {
            next(err);
        }
    }
)

router.post('/mail/authcode', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.authcodeMail(
                req.body.student_enrolled,
                req.body.student_grade,
                req.body.student_class,
                req.body.student_no,
                req.body.student_name
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/mail/pw', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.pwResetMail(req.body.id)
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/mail/id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.findIdMail(
                req.body.student_enrolled,
                req.body.student_grade,
                req.body.student_class,
                req.body.student_no,
                req.body.student_name
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.put('/pw', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.pwEdit(
                res,
                req.cookies.token,
                req.body.pw,
                req.body.pw_check
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.put('/nickname', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = new User(jwt.verify(req.cookies.token));
    try {
        res.send(JSON.stringify(
            await service.nicknameEdit(
                res,
                user,
                req.body.nickname
            )
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/token', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        res.send(JSON.stringify(
            await service.token(req.body.refreshToken)
        ));
    } catch(err) {
        next(err);
    }
})

router.post('/profile',
    loginCheck,
    multer({
        storage:multer.diskStorage({
            destination:(req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, 'public/resource/user/profile_images/');
            },
            filename:(req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                const user = new User(jwt.verify(req.cookies.token));
                cb(null, 'temp-profile_'+user.getUser().code+'.'+file.originalname.split('.')[file.originalname.split('.').length-1]);
            }
        })
    }).single('file'),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            if (!req?.file?.filename) {
                throw new InternalServerException('Failed to upload profile image');
            }
            res.send(JSON.stringify(
                await service.profileUpload(req.file.filename)
            ));
        } catch(err) {
            next(err);
        }
    }
)

export = router;