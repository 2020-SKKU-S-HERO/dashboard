"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express = require("express");
const nunjucks = require("nunjucks");
const status_1 = require("./routes/status");
class App {
    constructor() {
        this.app = express();
        this.setStatic();
        this.setRouting();
        this.setViewEngine();
    }
    setStatic() {
        this.app.use("/css", express.static("css"));
        this.app.use("/images", express.static("images"));
        this.app.use("/js", express.static("js"));
        this.app.use("/fonts", express.static("fonts"));
    }
    setRouting() {
        this.app.get("", (req, res) => {
            res.render("index.html");
        });
        this.app.use("/status", status_1.status);
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