const express = require('express')
const router = express.Router()

router.get('/meal', (req ,res) => res.render('../app/meal', {
    member:{
        isLogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    }
}))
router.get('/timetable', (req ,res) => res.render('../app/timetable', {
    member:{
        isLogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    }
}))
router.get('/meister', (req ,res) => res.render('../app/meister', {
    member:{
        isLogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    }
}))
router.get('/board/write/:boardType', (req ,res) => res.render('../app/post_write', {
    member:{
        isLogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    },
    boardType:req.params.boardType,
    postNo:req.params.postNo,
}))
router.get('/board/write/:boardType/:postNo', (req ,res) => res.render('../app/post_write', {
    member:{
        isLogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    },
    boardType:req.params.boardType,
    postNo:req.params.postNo,
}))
module.exports = router;