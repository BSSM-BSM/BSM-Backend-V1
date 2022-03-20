const express = require('express');
const router = express.Router();

const apiRouter = require('./api/api.controller');
const viewRouter = require('./view/view.controller');

// 업데이트 확인 url 하위호환
const versionController = require('./api/version/version.controller');
router.post('/database', versionController.getVersionLegacy);

router.use('/api', apiRouter);
router.use('/', viewRouter);

router.use((req, res) => {
    res.status(404).render('404');
})

module.exports = router;