"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express = require("express");
const router = express.Router();
exports.loginRouter = router;
router.use('/css', express.static('css'));
router.use('/images', express.static('images'));
router.use('/js', express.static('js'));
router.use('/fonts', express.static('fonts'));
router.get('/', (req, res) => {
    res.render('login.html');
});
router.post('/', (req, res) => {
});
//# sourceMappingURL=login.js.map