require("dotenv").config({ path: "./config/env/.env" });
const express = require('express')
const cookieParser = require('cookie-parser');
const helmet = require("helmet");

const app = express()

// 보안설정
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.set('etag', false)
// app.set('trust proxy', 1)
app.use(cookieParser());
const jwt = require('./jwt')

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

app.use(async (req, res) => {
        const jwtValue = await jwt.check(req.cookies.token);
        res.status(404).render('404', {
            member:{
                isLogin:jwtValue.isLogin,
                code:jwtValue.memberCode,
                id:jwtValue.memberId,
                nickname:jwtValue.memberNickname,
                level:jwtValue.memberLevel,
                grade:jwtValue.grade,
                classNo:jwtValue.classNo,
                studentNo:jwtValue.studentNo,
            }
        })
    })
app.listen(4000)