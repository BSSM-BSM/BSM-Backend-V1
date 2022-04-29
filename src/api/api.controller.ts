import express from 'express';
const router = express.Router();
import * as jwt from '../util/jwt';

router.use(express.json());
router.use(express.urlencoded({extended:true}));

import versionController from './version/version.controller';
import accountController from './account/account.controller';
import mealController from './school/meal/meal.controller';
import pushController from './webpush/push.controller';
import timetableController from './school/timetable/timetable.controller';
import meisterController from './school/meister/meister.controller';
import boardController from './board/board.controller';
import postController from './board/post.controller';
import commentController from './board/comment.controller';
import likeController from './board/like.controller';
import emoticonController from './board/emoticon.controller';
import loginCheck from '../util/loginCheck';

router.use(jwt.refreshToken);

router.use(versionController);
router.use(accountController);
router.use(mealController);
router.use(pushController);
router.use(timetableController);
router.use(loginCheck, meisterController);
router.use(boardController);
router.use(postController);
router.use(commentController);
router.use(likeController);
router.use(loginCheck, emoticonController);

export = router;