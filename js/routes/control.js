"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlRouter = void 0;
const express = require("express");
const router = express.Router();
exports.controlRouter = router;
router.get('/', (req, res) => {
    res.render("control.html");
});
//# sourceMappingURL=control.js.map