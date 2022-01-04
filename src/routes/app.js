const express = require('express')
const router = express.Router()

router.get('/meal', async (req ,res) => {
    const jwtValue = await jwt.check(req.cookies.token);
    res.render('../app/meal', {
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
router.get('/timetable', async (req ,res) => {
    const jwtValue = await jwt.check(req.cookies.token);
    res.render('../app/timetable', {
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
router.get('/meister', async (req ,res) => {
    const jwtValue = await jwt.check(req.cookies.token);
    res.render('../app/meister', {
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
router.get('/board/write/:boardType', async (req ,res) => {
    const jwtValue = await jwt.check(req.cookies.token);
    res.render('../app/post_write', {
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
router.get('/board/write/:boardType/:postNo', async (req ,res) => {
    const jwtValue = await jwt.check(req.cookies.token);
    res.render('../app/post_write', {
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
module.exports = router;