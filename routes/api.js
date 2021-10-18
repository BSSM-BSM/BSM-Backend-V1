const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended:false}))

const controller = require('../controllers/api/login')

router.post('/login', controller.login)

router.post('/islogin', controller.islogin)
// router.post('/board/:action', (req ,res) => {
//     let model = require('../models/board')
//     res.send(model.islogin())
// })

module.exports = router