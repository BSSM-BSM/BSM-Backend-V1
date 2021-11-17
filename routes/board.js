const express = require('express')
const router = express.Router()

router.get('/write/:boardType', (req ,res) => res.render('post_write', {
    member:{
        islogin:req.session.islogin,
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
router.get('/write/:boardType/:postNo', (req ,res) => res.render('post_write', {
    member:{
        islogin:req.session.islogin,
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
router.get('/:boardType', (req ,res) => res.render('board', {
    member:{
        islogin:req.session.islogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    },
    boardType:req.params.boardType,
    page:req.query.page,
    postNo:null,
}))
router.get('/:boardType/:postNo', (req ,res) => res.render('board', {
    member:{
        islogin:req.session.islogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    },
    boardType:req.params.boardType,
    page:req.query.page,
    postNo:req.params.postNo,
}))

module.exports = router