require("dotenv").config({ path: "./config/env/.env" });
const express = require('express')
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express()
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new FileStore(),
    })
);

const indexRouter = require('./routes/index')
const boardRouter = require('./routes/board')
const databaseRouter = require('./routes/database')

app.set('view engine', 'ejs')
app.set('views', './views/pages');
app.use(express.static('public'));

app.use('/', indexRouter)
app.use('/board', boardRouter)
app.use('/database', databaseRouter)

app.use((req, res, next) => res.status(404).render('404', {}))
app.use((err, req, res, next) => res.status(500).render('500', {}))
app.listen(80)