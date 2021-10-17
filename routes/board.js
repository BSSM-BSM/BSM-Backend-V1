const express = require('express')
const router = express.Router()

router.get('/:boardType', (req ,res) => res.send(req.params))
router.get('/:boardType/:postNo', (req ,res) => res.send(req.params))

module.exports = router