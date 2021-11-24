require("dotenv").config({ path: "./config/env/.env" });
const express = require('express')
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express()
app.set('etag', false)
//app.set('trust proxy', 1)
app.use(
    session({
        proxy:true,
        key:'SESSION',
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            path:"/",
            httpOnly:true,
            //secure:true,
            maxAge:24*14*1000*60*60// 14일간 저장 24시간*14일*1000ms*60초*60분
        },
        store:new FileStore({logFn: function(){}}),
    })
);

const indexRouter = require('./routes/index')
const boardRouter = require('./routes/board')
const appRouter = require('./routes/app')
const apiRouter = require('./routes/api')
const logoutRouter = require('./routes/logout')

app.set('view engine', 'ejs')
app.set('views', './views/pages');
app.use(express.static('public'));

app.use('/', indexRouter)
app.use('/board', boardRouter)
app.use('/app', appRouter)
app.use('/api', apiRouter)
app.use('/logout', logoutRouter)

const versionController = require('./controllers/api/version')
app.post('/database', versionController.getLegacy)// 업데이트 확인 url 하위호환

app.use((req, res, next) => res.status(404).render('404', {
    member:{
        isLogin:req.session.isLogin,
        code:req.session.memberCode,
        id:req.session.memberId,
        nickname:req.session.memberNickname,
        level:req.session.memberLevel,
        grade:req.session.grade,
        classNo:req.session.classNo,
        studentNo:req.session.studentNo,
    },
}))
app.listen(4000)