const express = require('express');
const router = express.Router();

router.get('/write/:boardType', (req ,res) => {
    res.render('post_write', {
        boardType:req.params.boardType,
        postNo:null,
    });
});

router.get('/write/:boardType/:postNo', (req ,res) => {
    res.render('post_write', {
        boardType:req.params.boardType,
        postNo:req.params.postNo,
    });
});

router.get('/:boardType', (req ,res) => {
    res.render('board');
});

router.get('/:boardType/:postNo', (req ,res) => {
    res.render('board');
});

module.exports = router;