import * as express from 'express';
import * as nunjucks from 'nunjucks';
import * as bodyParser from 'body-parser';
import { emissionsRouter } from './routes/emissions';
import { controlRouter } from './routes/control';

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
            res.render('index.html');
        });
        
        this.app.use('/emissions', emissionsRouter);
        this.app.use('/control', controlRouter);
    }
    
    setViewEngine(): void {
        nunjucks.configure('template', {
            autoescape: true,
            express: this.app
        });
    }
    
    setMiddleWare(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

export const app: express.Express = new App().app;