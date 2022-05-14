import express from 'express';
const router = express.Router();
import * as jwt from '@src/util/jwt';
import boardController from '@src/view/board.controller';

router.get('/', (req:express.Request, res:express.Response) => {
    res.render('index');
})

router.get('/user/:viewUsercode', (req ,res) => {
    res.render('user');
})

router.get('/meal', (req ,res) => {
    res.render('meal');
})

router.get('/timetable', (req ,res) => {
    res.render('timetable');
})

router.get('/meister', (req ,res) => {
    res.render('meister');
})

router.get('/pwReset', (req ,res) => {
    const {token} = req.query;
    if (typeof token != 'string') {
        return res.send("정상적인 접근이 아닙니다");
    }
    const jwtValue = jwt.verify(token);
    if (jwtValue.message=='EXPIRED') {
        return res.send("토큰 유효기간이 만료되었습니다");
    }
    if (!jwtValue.value.pwEdit) {
        return res.send("정상적인 접근이 아닙니다");
    }

    res.cookie('token', req.query.token, {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 1000*60*5
    });
    res.render('etc/pwReset');
})

router.get('/emoticon', (req ,res) => {
    res.render('emoticon');
})

router.get('/login', (req ,res) => {
    res.render('etc/login');
})

router.use('/board', boardController);

export = router;