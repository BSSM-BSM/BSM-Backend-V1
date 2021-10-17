const express = require('express')
const router = express.Router()

router.use(express.json());
router.use(express.urlencoded({extended:false}));

var result={
    status:2,
};

router.post('/login', async (req ,res) => {
        let model = require('../models/login')
        if(await model.login(req.body.member_id, req.body.member_pw)){
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