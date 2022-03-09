const express = require('express')
const router = express.Router()
const jwt = require('../util/jwt')
const multer = require('multer')

const loginCheck = (req, res, next) => {
  const jwtValue = jwt.check(req.cookies.token);
  if(!jwtValue.isLogin){
    return res.send(JSON.stringify(jwtValue.msg));
  }
  next();
}
const imageUpload = multer({
  storage:multer.diskStorage({
    destination:(req, file, cb) => {
      const jwtValue = jwt.check(req.cookies.token);
      if(!jwtValue.isLogin) return;
      cb(null, 'public/resource/board/upload_images/')
    },
    filename:(req, file, cb) => {
      cb(null, Date.now()+'.'+file.originalname.split('.')[file.originalname.split('.').length-1])
    }
  })
})
const profileUpload = multer({
  storage:multer.diskStorage({
    destination:(req, file, cb) => {
      const jwtValue = jwt.check(req.cookies.token);
      if(!jwtValue.isLogin) return;
      cb(null, 'public/resource/member/profile_images/')
    },
    filename:(req, file, cb) => {
      const jwtValue = jwt.check(req.cookies.token);
      cb(null, 'temp-profile_'+jwtValue.memberCode+'.'+file.originalname.split('.')[file.originalname.split('.').length-1])
    }
  })
})

router.use(express.json())
router.use(express.urlencoded({extended:true}))

const versionController = require('./version/version.controller')
const accountController = require('./account/account.controller')
const searchController = require('./search/search.controller')
const mealController = require('./school/meal/meal.controller')
const pushController = require('./webpush/push.controller')
const timetableController = require('./school/timetable/timetable.controller')
const meisterController = require('./school/meister/meister.controller')
const boardController = require('./board/board.controller')
const postController = require('./board/post.controller')
const commentController = require('./board/comment.controller')
const likeController = require('./board/like.controller')
const imageUploadController = require('./board/imageUpload.controller')
const emoticonController = require('./board/emoticon.controller')

router.post('/account/login', accountController.login)
router.delete('/account/logout', accountController.logout)
router.post('/account/pwEdit', accountController.pwEdit)
router.post('/account/signUp', accountController.signUp)
router.post('/account/validCode', accountController.validCode)
router.post('/account/pwResetMail', accountController.pwResetMail)
router.post('/account/token', accountController.token)

router.use(jwt.refreshToken)

router.get('/account/islogin', accountController.islogin)
router.get('/account/:memberCode', accountController.view)
router.post('/account/profileUpload', loginCheck, profileUpload.single('file'), accountController.profileUpload)

router.post('/meal/register', pushController.register)

router.get('/version/:app/:os', versionController.get)

router.get('/search/:searchType/:searchStr', searchController.get)

router.get('/meal/:mealDate', mealController.get)

router.get('/timetable/:grade/:classNo', timetableController.get)

router.post('/meister/point/:grade/:classNo/:studentNo', meisterController.getPoint)
router.get('/meister/score/:grade/:classNo/:studentNo', meisterController.getScore)

router.get('/board/:boardType', boardController.view)

router.get('/post/:boardType/:postNo', postController.view)
router.post('/post/:boardType', postController.write)
router.put('/post/:boardType/:postNo', postController.update)
router.delete('/post/:boardType/:postNo', postController.del)

router.get('/comment/:boardType/:postNo', commentController.view)
router.post('/comment/:boardType/:postNo/:depth/:parentIdx', commentController.write)
router.post('/comment/:boardType/:postNo', commentController.write)
router.delete('/comment/:boardType/:postNo/:commentIdx', commentController.del)

router.post('/like/:boardType/:postNo', likeController.like)

router.post('/imageUpload', loginCheck, imageUpload.single('file'), imageUploadController.upload)

router.get('/emoticon/:id', loginCheck, emoticonController.getemoticon)
router.get('/emoticon', loginCheck, emoticonController.getemoticons)
router.post('/emoticon', loginCheck, emoticonController.uploadProcessing.fields([{name:'file'},{name:'files'}]), emoticonController.uploadCheck)

module.exports = router