"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataInputRouter = void 0;
const express = require("express");
const db_control_1 = require("../db_control");
const router = express.Router();
exports.dataInputRouter = router;
router.use('/css', express.static('css'));
router.use('/images', express.static('images'));
router.use('/js', express.static('js'));
router.use('/fonts', express.static('fonts'));
router.get('/', (req, res) => {
    res.render('datainput/home.html');
});
router.post('/', (req, res) => {
    const body = req.body;
    const resourceData = {
        'limestone': body.limestone,
        'clay': body.clay,
        'silicaStone': body.silicaStone,
        'ironOxide': body.ironOxide,
        'gypsum': body.gypsum,
        'coal': body.coal
    };
    db_control_1.insertResourceInput(resourceData, () => { });
    res.render('datainput/home.html');
});
//# sourceMappingURL=datainput.js.map