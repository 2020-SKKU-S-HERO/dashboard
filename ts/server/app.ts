import * as express from 'express';
import * as nunjucks from 'nunjucks';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { emissionsRouter } from './routes/emissions';
import { loginRouter } from './routes/login';
import { dataInputRouter } from './routes/datainput';
import { insertAndroidToken } from './db_control';
import * as bot from './telegrambot';

class App {
    
    readonly app: express.Express;
    
    constructor() {
        this.app = express();
        
        this.setMiddleWare();
        this.setStatic();
        this.setRouting();
        this.setViewEngine();
    }
    
    setStatic(): void {
        this.app.use('/css', express.static('css'));
        this.app.use('/images', express.static('images'));
        this.app.use('/js', express.static('js'));
        this.app.use('/fonts', express.static('fonts'));
    }
    
    setRouting(): void {
        this.app.get('', (req, res): void => {
            res.writeHead(302, { 'Location': 'emissions/home' });
            res.end();
        });
        
        this.app.use('/emissions', emissionsRouter);
        this.app.use('/login', loginRouter);
        this.app.use('/data-input', dataInputRouter);
    }
    
    setViewEngine(): void {
        nunjucks.configure('template', {
            autoescape: true,
            express: this.app
        });
    }
    
    setMiddleWare(): void {
        //this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

export const app: express.Express = new App().app;

app.post('/alert/token', (req: any, res: any): void => {
    insertAndroidToken(req.body, (): void => {
    
    });
    res.send('token registered');
});

bot.startTelegramBot();