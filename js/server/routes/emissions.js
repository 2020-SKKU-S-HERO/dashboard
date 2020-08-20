"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emissionsRouter = void 0;
const express = require("express");
const db_control = require("../db_control");
const router = express.Router();
exports.emissionsRouter = router;
function addCommaInNumber(num) {
    const sign = num < 0 ? '-' : '';
    const numberStr = Math.abs(num).toString();
    let resultStr = '';
    const point = numberStr.length % 3;
    let pos = 0;
    while (pos < numberStr.length) {
        if (pos % 3 === point && pos !== 0) {
            resultStr += ',';
        }
        resultStr += numberStr[pos];
        pos++;
    }
    return sign + resultStr;
}
router.use('/css', express.static('css'));
router.use('/images', express.static('images'));
router.use('/js', express.static('js'));
router.use('/fonts', express.static('fonts'));
router.get('/home', (req, res) => {
    res.render('emissions/home.html');
});
router.get('/workplace1', (req, res) => {
    res.render('emissions/workplace1.html');
});
router.get('/workplace2', (req, res) => {
    res.render('emissions/workplace2.html');
});
router.get('/workplace3', (req, res) => {
    res.render('emissions/workplace3.html');
});
router.post('/home/todayEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getTodayEmissions(location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/home/thisYearEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getThisYearEmissions(location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/home/thisYearRemainingPermissibleEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getThisYearRemainingPermissibleEmissions(location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/home/todayComparedToThisMonthAverageEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getTodayRatioComparedToThisMonthAverage(location, (data) => {
        res.send(data.toFixed(1) + '%');
    });
});
router.post('/home/theMostPastEmissionMonth', (req, res) => {
    const location = req.body.location;
    db_control.getTheMostPastEmissionMonth(location, (data) => {
        res.send(data.toString());
    });
});
router.post('/home/selectedMonthEmissions', (req, res) => {
    const location = req.body.location;
    const year = Number(req.body.year);
    const month = Number(req.body.month);
    db_control.getSelectedMonthEmissions(new Date(year, month - 1, 2), location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/home/selectedMonthComparedToLastYear', (req, res) => {
    const location = req.body.location;
    const year = Number(req.body.year);
    const month = Number(req.body.month);
    const selectedMonth = new Date(year, month - 1, 2);
    const lastYearSameMonth = new Date(year - 1, month - 1, 2);
    db_control.getSelectedMonthEmissions(selectedMonth, location, (selectedMonthData) => {
        db_control.getSelectedMonthEmissions(lastYearSameMonth, location, (lastYearData) => {
            if (selectedMonthData !== 0 && lastYearData !== 0) {
                res.send((((selectedMonthData / lastYearData) - 1) * 100).toFixed(1) + '%');
            }
            else {
                res.send('-');
            }
        });
    });
});
router.post('/home/selectedYearEmissions', (req, res) => {
    const location = req.body.location;
    const year = Number(req.body.year);
    db_control.getSelectedYearEmissions(year, location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/home/selectedYearComparedToLastYear', (req, res) => {
    const location = req.body.location;
    const year = Number(req.body.year);
    db_control.getSelectedYearEmissions(year, location, (selectedYearData) => {
        db_control.getSelectedYearEmissions(year - 1, location, (lastYearData) => {
            if (selectedYearData !== 0 && lastYearData !== 0) {
                res.send((((selectedYearData / lastYearData) - 1) * 100).toFixed(1) + '%');
            }
            else {
                res.send('-');
            }
        });
    });
});
//# sourceMappingURL=emissions.js.map