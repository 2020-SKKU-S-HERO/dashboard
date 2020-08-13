"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emissionsRouter = void 0;
const express = require("express");
const router = express.Router();
exports.emissionsRouter = router;
router.use('/css', express.static('css'));
router.use('/images', express.static('images'));
router.use('/js', express.static('js'));
router.use('/fonts', express.static('fonts'));
router.get('/home', (req, res) => {
    res.render("emissions/home.html");
});
router.get('/workplace1', (req, res) => {
    res.render("emissions/workplace1.html");
});
router.get('/workplace2', (req, res) => {
    res.render("emissions/workplace2.html");
});
router.get('/workplace3', (req, res) => {
    res.render("emissions/workplace3.html");
});
//# sourceMappingURL=emissions.js.map