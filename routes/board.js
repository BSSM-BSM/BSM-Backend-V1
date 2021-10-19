const express = require('express')
const router = express.Router()

router.get('/:boardType', (req ,res) => res.render('board', {
    member:{
        islogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
    },
    boardType:req.params.boardType,
    page:req.query.page,
    postNo:null,
}))
router.get('/:boardType/:postNo', (req ,res) => res.render('board', {
    member:{
        islogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
    },
    boardType:req.params.boardType,
    page:req.query.page,
    postNo:req.params.postNo,
}))

module.exports = router