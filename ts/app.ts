import * as express from "express";
import * as nunjucks from "nunjucks";
import { admin } from "./routes/admin";

class App {
    
    readonly app: express.Express;
    
    constructor() {
        this.app = express();
    
        this.setRouting();
        this.setViewEngine();
    }
    
    setRouting(): void {
        this.app.use("/admin", admin);
    }
    
    setViewEngine(): void {
        nunjucks.configure("template", {
            autoescape: true,
            express: this.app
        });
    }
    
}

export const app: express.Express = new App().app;