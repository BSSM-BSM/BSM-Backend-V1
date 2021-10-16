const express = require('express')
const app = express()

const indexRouter = require('./routes/index')
const boardRouter = require('./routes/board')

app.set('view engine', 'ejs')
app.set('views', './views/pages');
app.use(express.static('public'));

app.use('/', indexRouter)
app.use('/board', boardRouter)

app.use((req, res, next) => res.status(404).render('404', {}))
app.use((err, req, res, next) => res.status(500).render('500', {}))
app.listen(80)