const express = require('express')
const router = express.Router()

router.get('/', (req ,res) => res.render('index', {
    member:{
        islogin:req.session.islogin,
        code:req.session.member_code,
        id:req.session.member_id,
        nickname:req.session.member_nickname,
        level:req.session.member_level,
    }
}))
router.get('/meal', (req ,res) => res.render('meal', {
    member:{
        islogin:req.session.islogin,
        code:req.session.member_code,
        id:req.session.member_id,
        nickname:req.session.member_nickname,
        level:req.session.member_level,
    }
}))
router.get('/timetable', (req ,res) => res.render('timetable', {
    member:{
        islogin:req.session.islogin,
        code:req.session.member_code,
        id:req.session.member_id,
        nickname:req.session.member_nickname,
        level:req.session.member_level,
    }
}))

module.exports = router;