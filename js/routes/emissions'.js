"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emissionsRouter = void 0;
const express = require("express");
const router = express.Router();
exports.emissionsRouter = router;
router.get('/', (req, res) => {
    res.render("dashboard/home.html");
});
//# sourceMappingURL=emissions'.js.map