const express = require('express')
const router = express.Router()

router.get('/', (req ,res) => res.render('index', {
    member:{
        islogin:req.session.islogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    }
}))
router.get('/meal', (req ,res) => res.render('meal', {
    member:{
        islogin:req.session.islogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    }
}))
router.get('/timetable', (req ,res) => res.render('timetable', {
    member:{
        islogin:req.session.islogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    }
}))

module.exports = router;