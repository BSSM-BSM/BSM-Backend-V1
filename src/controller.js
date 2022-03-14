const express = require('express');
const router = express.Router();
const jwt = require('./util/jwt');

const apiRouter = require('./api/api.controller');
const viewRouter = require('./view/view.controller');

const versionController = require('./api/version/version.controller');
router.post('/database', versionController.getVersionLegacy);// 업데이트 확인 url 하위호환


router.use('/api', apiRouter);
router.use('/', viewRouter);


router.use((req, res) => {
    const jwtValue = jwt.check(req.cookies.token);
    res.status(404).render('404', {
        member:{
            isLogin:jwtValue.isLogin,
            code:jwtValue.memberCode,
            id:jwtValue.memberId,
            nickname:jwtValue.memberNickname,
            level:jwtValue.memberLevel,
            grade:jwtValue.grade,
            classNo:jwtValue.classNo,
            studentNo:jwtValue.studentNo,
        }
    })
})

module.exports = router;