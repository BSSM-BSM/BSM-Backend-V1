const express = require('express')
const router = express.Router()

router.get('/2021/:name', (req ,res) => res.render('birth', {
    name:req.params.name,
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

module.exports = router;