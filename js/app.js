"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const dashboard_1 = require("./routes/dashboard");
const control_1 = require("./routes/control");
class App {
    constructor() {
        this.app = express();
        this.setMiddleWare();
        this.setStatic();
        this.setRouting();
        this.setViewEngine();
    }
    setStatic() {
        this.app.use('/css', express.static('css'));
        this.app.use('/images', express.static('images'));
        this.app.use('/js', express.static('js'));
        this.app.use('/fonts', express.static('fonts'));
    }
    setRouting() {
        this.app.get('', (req, res) => {
            res.render('index.html');
        });
        this.app.use('/dashboard', dashboard_1.dashboardRouter);
        this.app.use('/control', control_1.controlRouter);
    }
    setViewEngine() {
        nunjucks.configure('template', {
            autoescape: true,
            express: this.app
        });
    }
    setMiddleWare() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
exports.app = new App().app;
//# sourceMappingURL=app.js.map