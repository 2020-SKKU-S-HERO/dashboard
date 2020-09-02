"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const emissions_1 = require("./routes/emissions");
const login_1 = require("./routes/login");
const datainput_1 = require("./routes/datainput");
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
        this.app.use('/emissions', emissions_1.emissionsRouter);
        this.app.use('/login', login_1.loginRouter);
        this.app.use('/data-input', datainput_1.dataInputRouter);
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
exports.app.post('/alert/token', (req, res) => {
    console.log(req.body);
    res.send('hello');
});
//# sourceMappingURL=app.js.map