const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended:false}))

const loginController = require('../controllers/api/login')
const boardController = require('../controllers/api/board')
const postController = require('../controllers/api/post')

router.post('/login', loginController.login)
router.post('/islogin', loginController.islogin)
router.post('/board', boardController.view)
router.post('/post', postController.view)

module.exports = router