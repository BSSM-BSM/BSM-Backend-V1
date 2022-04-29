import express from 'express';
const router = express.Router();

import apiRouter from './api/api.controller';
import viewRouter from './view/view.controller';

// 업데이트 확인 url 하위호환
router.post('/database', (req, res) => {
    res.send(JSON.stringify({
        status:1,
        subStatus:0,
        versionCode:8,
        versionName:'1.0.0\n안드로이드 네이티브 앱은 지원이 종료되었습니다\n웹 앱을 다운 받아주세요'
    }))
});

router.use('/api', apiRouter);
router.use('/', viewRouter);

router.use((req, res) => {
    res.status(404).render('404');
})

module.exports = router;