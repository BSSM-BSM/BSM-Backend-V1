import express from 'express';
const router = express.Router();

router.get('/:boardType', (req ,res) => {
    res.render('board');
});

router.get('/:boardType/:postNo', (req ,res) => {
    res.render('board');
});

export = router;