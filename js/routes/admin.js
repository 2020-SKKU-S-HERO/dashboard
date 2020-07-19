"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const express = require("express");
const router = express.Router();
exports.admin = router;
router.get('/', (req, res) => {
    res.send("admin app");
});
//# sourceMappingURL=admin.js.map