import express from 'express';
const router = express.Router();
import * as jwt from '../util/jwt';

router.use(express.json({limit:'1mb'}));
router.use(express.urlencoded({extended:true,limit:'1mb'}));

import versionController from './version/version.controller';
import oauthController from './oauth/oauth.controller';
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

router.use('/oauth', loginCheck, oauthController);
router.use('/version', versionController);
router.use('/account', accountController);
router.use('/meal', mealController);
router.use('/push', pushController);
router.use('/timetable', timetableController);
router.use('/board', boardController);
router.use('/post', postController);
router.use('/comment', commentController);
router.use('/like', likeController);
router.use('/meister', loginCheck, meisterController);
router.use('/emoticon', loginCheck, emoticonController);

export = router;