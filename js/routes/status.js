"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
const express = require("express");
const router = express.Router();
exports.status = router;
router.get('/', (req, res) => {
    res.render("status/status.html");
});
//# sourceMappingURL=status.js.map