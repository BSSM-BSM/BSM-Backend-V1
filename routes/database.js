const express = require('express')
const router = express.Router()

router.use(express.json());
router.use(express.urlencoded({extended:false}));

var result={
    status:2,
}
var dbResult={
    bool:false,
}
router.post('/login', async (req ,res) => {
        let model = require('../models/login')
        dbResult = await model.login(req.body.member_id, req.body.member_pw)
        if(dbResult.bool){
            req.session.islogin=true
            req.session.member_code=dbResult.member_code
            req.session.member_id=dbResult.member_id
            req.session.member_nickname=dbResult.member_nickname
            req.session.member_level=dbResult.member_level
            result={
                status:1,
                returnUrl:'/',
            };
        }else{
            result={
                status:4,
            };
        }
        res.send(JSON.stringify(result))
    }
)
router.post('/islogin', (req ,res) => {
    let model = require('../models/login')
    res.send(model.islogin())
}
)

module.exports = router