const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.set('views', './views/pages');
app.use(express.static('public'));

app.get('/', (req ,res) => res.render('index', {}))
app.get('/meal', (req ,res) => res.render('meal', {}))
app.get('/timetable', (req ,res) => res.render('timetable', {}))

app.listen(80)