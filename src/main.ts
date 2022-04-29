import dotenv from 'dotenv';
dotenv.config({path: "./config/env/.env"});
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpError } from './util/exceptions';
const processName = process.env.name;
const app = express();

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

app.set('etag', false);
app.set('trust proxy', 1);
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views/pages');
app.use(express.static('public'));

const controller = require('./controller');
app.use('/', controller);

app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.httpCode) {
        res.status(err.httpCode).send(JSON.stringify({
            statusCode: err.httpCode,
            message: err.message
        }));
    } else {
        console.error(err);
        res.status(500).send(JSON.stringify({
            statusCode: 500,
            message: 'Internal Server Error'
        }));
    }
});

if (processName == 'primary') {
    const schedule = {
        meal: require('./schedule/meal')
    };
}

app.listen(4000);