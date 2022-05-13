import express from 'express';
const router = express.Router();
import * as jwt from '../util/jwt';

router.use(express.json({limit:'1mb'}));
router.use(express.urlencoded({extended:true,limit:'1mb'}));
import loginCheck from '@src/util/loginCheck';

import versionController from '@src/api/version/version.controller';
import oauthController from '@src/api/oauth/oauth.controller';
import accountController from '@src/api/account/account.controller';
import mealController from '@src/api/school/meal/meal.controller';
import pushController from '@src/api/webpush/push.controller';
import timetableController from '@src/api/school/timetable/timetable.controller';
import meisterController from '@src/api/school/meister/meister.controller';
import boardController from '@src/api/board/board.controller';
import postController from '@src/api/board/post.controller';
import commentController from '@src/api/board/comment.controller';
import likeController from '@src/api/board/like.controller';
import emoticonController from '@src/api/board/emoticon.controller';

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