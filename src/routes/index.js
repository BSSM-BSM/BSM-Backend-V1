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

module.exports = router;