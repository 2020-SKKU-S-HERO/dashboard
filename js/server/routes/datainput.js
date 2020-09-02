"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataInputRouter = void 0;
const express = require("express");
const router = express.Router();
exports.dataInputRouter = router;
router.use('/css', express.static('css'));
router.use('/images', express.static('images'));
router.use('/js', express.static('js'));
router.use('/fonts', express.static('fonts'));
router.get('/', (req, res) => {
    res.render('datainput/home.html');
});
//# sourceMappingURL=datainput.js.map