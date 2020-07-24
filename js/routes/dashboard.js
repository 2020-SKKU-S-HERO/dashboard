"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express = require("express");
const router = express.Router();
exports.dashboardRouter = router;
router.get('/', (req, res) => {
    res.render("dashboard.html");
});
//# sourceMappingURL=dashboard.js.map