require("dotenv").config({ path: "./config/env/.env" });
const express = require('express')
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express()
app.use(
    session({
        key:'SESSION',
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
        store:new FileStore(),
    })
);

const indexRouter = require('./routes/index')
const boardRouter = require('./routes/board')
const apiRouter = require('./routes/api')
const logoutRouter = require('./routes/logout')

app.set('view engine', 'ejs')
app.set('views', './views/pages');
app.use(express.static('public'));

app.use('/', indexRouter)
app.use('/board', boardRouter)
app.use('/api', apiRouter)
app.use('/logout', logoutRouter)

app.use((req, res, next) => res.status(404).render('404', {
    member:{
        islogin:req.session.islogin,
        code:req.session.member_code,
        id:req.session.member_id,
        nickname:req.session.member_nickname,
        level:req.session.member_level,
    }
}))
app.listen(80)