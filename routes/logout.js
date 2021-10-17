const express = require('express')
const router = express.Router()

router.get('/', (req ,res) => {
    req.session.destroy(() => {
        res.clearCookie('SESSION');
        res.redirect('/');
    });
})

module.exports = router;