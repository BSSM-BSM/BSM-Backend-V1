import express from 'express';
const router = express.Router();

router.get('/write/:boardType', (req:express.Request, res:express.Response) => {
    res.render('post_write', {
        boardType: req.params.boardType,
        postNo: null,
    });
});

router.get('/write/:boardType/:postNo', (req ,res) => {
    res.render('post_write', {
        boardType: req.params.boardType,
        postNo: req.params.postNo,
    });
});

router.get('/:boardType', (req ,res) => {
    res.render('board');
});

router.get('/:boardType/:postNo', (req ,res) => {
    res.render('board');
});

export = router;