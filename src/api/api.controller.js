const express = require('express');
const router = express.Router();
const jwt = require('../util/jwt');

router.use(express.json());
router.use(express.urlencoded({extended:true}));

const versionController = require('./version/version.controller');
const accountController = require('./account/account.controller');
const mealController = require('./school/meal/meal.controller');
const pushController = require('./webpush/push.controller');
const timetableController = require('./school/timetable/timetable.controller');
const meisterController = require('./school/meister/meister.controller');
const boardController = require('./board/board.controller');
const postController = require('./board/post.controller');
const commentController = require('./board/comment.controller');
const likeController = require('./board/like.controller');
const emoticonController = require('./board/emoticon.controller');

router.use(jwt.refreshToken);

router.use(versionController);
router.use(accountController);
router.use(mealController);
router.use(pushController);
router.use(timetableController);
router.use(meisterController);
router.use(boardController);
router.use(postController);
router.use(commentController);
router.use(likeController);
router.use(emoticonController);

module.exports = router;