const express = require('express')
const router = express.Router()
const jwt = require('../jwt')

router.get('/', (req ,res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.redirect('/');
})

module.exports = router;