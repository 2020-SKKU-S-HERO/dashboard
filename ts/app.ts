import * as express from "express";
import * as nunjucks from "nunjucks";
import { status } from "./routes/status";

class App {
    
    readonly app: express.Express;
    
    constructor() {
        this.app = express();
    
        this.setStatic();
        this.setRouting();
        this.setViewEngine();
    }
    
    setStatic(): void {
        this.app.use("/css", express.static("css"));
        this.app.use("/images", express.static("images"));
        this.app.use("/js", express.static("js"));
        this.app.use("/fonts", express.static("fonts"));
    }
    
    setRouting(): void {
        this.app.use("/status", status);
    }
    
    setViewEngine(): void {
        nunjucks.configure("template", {
            autoescape: true,
            express: this.app
        });
    }
    
}

export const app: express.Express = new App().app;