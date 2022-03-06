const express = require('express')
const router = express.Router()
const jwt = require('../util/jwt')

router.get('/write/:boardType', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('post_write', {
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
        boardType:req.params.boardType,
        postNo:null,
    })
})
router.get('/write/:boardType/:postNo', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('post_write', {
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
        boardType:req.params.boardType,
        postNo:req.params.postNo,
    })
})
router.get('/:boardType', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('board', {
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
router.get('/:boardType/:postNo', (req ,res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.render('board', {
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