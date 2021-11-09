const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended:false}))

const loginController = require('../controllers/api/login')
const boardController = require('../controllers/api/board')
const postController = require('../controllers/api/post')
const commentController = require('../controllers/api/comment')
const likeController = require('../controllers/api/like')

router.post('/login', loginController.login)
router.post('/islogin', loginController.islogin)

router.get('/board/:boardType', boardController.view)

router.get('/post/:boardType/:postNo', postController.view)
router.post('/post/:boardType', postController.write)
router.patch('/post/:boardType/:postNo', postController.update)
router.delete('/post/:boardType/:postNo', postController.del)

router.get('/comment/:boardType/:postNo', commentController.view)
router.post('/comment/:boardType/:postNo', commentController.write)
router.delete('/comment/:boardType/:postNo', commentController.del)

router.post('/like/:boardType/:postNo', likeController.like)

module.exports = router