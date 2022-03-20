const express = require('express');
const router = express.Router();
const jwt = require('../util/jwt');
const boardController = require('./board.controller');

router.get('/', (req ,res) => {
    res.render('index');
})

router.get('/memberinfo/:memberCode', (req ,res) => {
    res.render('memberinfo', {
        memberCode:req.params.memberCode
    });
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
    const jwtValue = jwt.verify(req.query.token);
    if(jwtValue=='EXPIRED'){
        return res.send("토큰 유효기간이 만료되었습니다");
    }
    if(!jwtValue.pwEdit){
        return res.send("정상적인 접근이 아닙니다");
    }
    res.cookie('token', req.query.token, {
        path:"/",
        httpOnly:true,
        secure:true,
        maxAge:1000*60*5
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

module.exports = router;