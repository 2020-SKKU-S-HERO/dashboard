"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
const express = require("express");
const router = express.Router();
exports.status = router;
router.get('/', (req, res) => {
    res.send("admin app");
});
//# sourceMappingURL=admin.js.map