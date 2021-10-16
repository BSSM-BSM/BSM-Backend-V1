const express = require('express')
const router = express.Router()

router.get('/', (req ,res) => res.render('index', {}))
router.get('/meal', (req ,res) => res.render('meal', {}))
router.get('/timetable', (req ,res) => res.render('timetable', {}))

module.exports = router;