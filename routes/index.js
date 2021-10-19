const express = require('express')
const router = express.Router()

router.get('/', (req ,res) => res.render('index', {
    member:{
        islogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
    }
}))
router.get('/meal', (req ,res) => res.render('meal', {
    member:{
        islogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
    }
}))
router.get('/timetable', (req ,res) => res.render('timetable', {
    member:{
        islogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
    }
}))

module.exports = router;