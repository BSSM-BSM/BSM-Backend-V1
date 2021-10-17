const express = require('express')
const router = express.Router()

router.get('/:boardType', (req ,res) => res.render('board', {
    member:{
        islogin:req.session.islogin,
        code:req.session.member_code,
        id:req.session.member_id,
        nickname:req.session.member_nickname,
        level:req.session.member_level,
    },
    boardType:req.params.boardType,
    postNo:null,
}))
router.get('/:boardType/:postNo', (req ,res) => res.render('board', {
    member:{
        islogin:req.session.islogin,
        code:req.session.member_code,
        id:req.session.member_id,
        nickname:req.session.member_nickname,
        level:req.session.member_level,
    },
    boardType:req.params.boardType,
    postNo:req.params.postNo,
}))

module.exports = router