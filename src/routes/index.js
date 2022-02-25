const express = require('express')
const router = express.Router()
const jwt = require('../jwt')

router.get('/', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('index', {
        member:{
            isLogin:jwtValue.isLogin,
            code:jwtValue.memberCode,
            id:jwtValue.memberId,
            nickname:jwtValue.memberNickname,
            level:jwtValue.memberLevel,
            grade:jwtValue.grade,
            classNo:jwtValue.classNo,
            studentNo:jwtValue.studentNo,
        }
    })
})
router.get('/memberinfo/:memberCode', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('memberinfo', {
        member:{
            isLogin:jwtValue.isLogin,
            code:jwtValue.memberCode,
            id:jwtValue.memberId,
            nickname:jwtValue.memberNickname,
            level:jwtValue.memberLevel,
            grade:jwtValue.grade,
            classNo:jwtValue.classNo,
            studentNo:jwtValue.studentNo,
        },
        memberCode:req.params.memberCode
    })
})
router.get('/meal', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('meal', {
        member:{
            isLogin:jwtValue.isLogin,
            code:jwtValue.memberCode,
            id:jwtValue.memberId,
            nickname:jwtValue.memberNickname,
            level:jwtValue.memberLevel,
            grade:jwtValue.grade,
            classNo:jwtValue.classNo,
            studentNo:jwtValue.studentNo,
        }
    })
})
router.get('/timetable', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('timetable', {
        member:{
            isLogin:jwtValue.isLogin,
            code:jwtValue.memberCode,
            id:jwtValue.memberId,
            nickname:jwtValue.memberNickname,
            level:jwtValue.memberLevel,
            grade:jwtValue.grade,
            classNo:jwtValue.classNo,
            studentNo:jwtValue.studentNo,
        }
    })
})
router.get('/meister', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('meister', {
        member:{
            isLogin:jwtValue.isLogin,
            code:jwtValue.memberCode,
            id:jwtValue.memberId,
            nickname:jwtValue.memberNickname,
            level:jwtValue.memberLevel,
            grade:jwtValue.grade,
            classNo:jwtValue.classNo,
            studentNo:jwtValue.studentNo,
        }
    })
})
router.get('/pwReset', (req ,res) => {
    const jwtValue = jwt.verify(req.query.token);
    if(jwtValue=='EXPIRED'){
        return res.send("토큰 유효기간이 만료되었습니다")
    }
    if(!jwtValue.pwEdit){
        return res.send("정상적인 접근이 아닙니다")
    }
    res.cookie('token', req.query.token, {
        path:"/",
        httpOnly:true,
        secure:true,
        maxAge:1000*60*5
    });
    res.render('etc/pwReset', {
        member:{
            isLogin:false,
            code:null,
            id:null,
            nickname:null,
            level:null,
            grade:null,
            classNo:null,
            studentNo:null,
        }
    })
})
router.get('/emoticon', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('emoticon', {
        member:{
            isLogin:jwtValue.isLogin,
            code:jwtValue.memberCode,
            id:jwtValue.memberId,
            nickname:jwtValue.memberNickname,
            level:jwtValue.memberLevel,
            grade:jwtValue.grade,
            classNo:jwtValue.classNo,
            studentNo:jwtValue.studentNo,
        }
    })
})
router.get('/login', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('etc/login', {
        member:{
            isLogin:jwtValue.isLogin,
            code:jwtValue.memberCode,
            id:jwtValue.memberId,
            nickname:jwtValue.memberNickname,
            level:jwtValue.memberLevel,
            grade:jwtValue.grade,
            classNo:jwtValue.classNo,
            studentNo:jwtValue.studentNo,
        }
    })
})

module.exports = router;