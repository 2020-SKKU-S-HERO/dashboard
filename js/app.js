"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express = require("express");
const nunjucks = require("nunjucks");
const admin_1 = require("./routes/admin");
class App {
    constructor() {
        this.app = express();
        this.setRouting();
        this.setViewEngine();
    }
    setRouting() {
        this.app.use("/admin", admin_1.admin);
    }
    setViewEngine() {
        nunjucks.configure("template", {
            autoescape: true,
            express: this.app
        });
    }
}
exports.app = new App().app;
//# sourceMappingURL=app.js.map