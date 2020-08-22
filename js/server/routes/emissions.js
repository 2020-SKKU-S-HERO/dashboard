"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emissionsRouter = void 0;
const express = require("express");
const db_control = require("../db_control");
const http = require("http");
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
router.post('/todayEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getTodayEmissions(location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/thisYearEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getThisYearEmissions(location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/thisYearRemainingPermissibleEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getThisYearRemainingPermissibleEmissions(location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/todayComparedToThisMonthAverageEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getTodayRatioComparedToThisMonthAverage(location, (data) => {
        res.send(data.toFixed(1) + '%');
    });
});
router.post('/theMostPastEmissionMonth', (req, res) => {
    const location = req.body.location;
    db_control.getTheMostPastEmissionMonth(location, (data) => {
        res.send(data.toString());
    });
});
router.post('/selectedMonthEmissions', (req, res) => {
    const location = req.body.location;
    const year = Number(req.body.year);
    const month = Number(req.body.month);
    db_control.getSelectedMonthEmissions(new Date(year, month - 1, 2), location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/selectedMonthComparedToLastYear', (req, res) => {
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
router.post('/selectedYearEmissions', (req, res) => {
    const location = req.body.location;
    const year = Number(req.body.year);
    db_control.getSelectedYearEmissions(year, location, (data) => {
        res.send(addCommaInNumber(data) + 't');
    });
});
router.post('/selectedYearComparedToLastYear', (req, res) => {
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
router.post('/weather', (req, res) => {
    const appId = '70da6bb9b7ebe370c2bf958bbf0d3ba4';
    const cityName = req.body.cityName;
    const options = {
        host: 'api.openweathermap.org',
        port: 80,
        path: `/data/2.5/weather?q=${cityName}&appid=${appId}`,
        method: 'GET'
    };
    http.get(options, (incomingMessage) => {
        let resData = '';
        incomingMessage.on('data', (chunk) => {
            resData += chunk;
        });
        incomingMessage.on('end', () => {
            const data = JSON.parse(resData);
            console.log(resData);
            res.send({ 'weather': data.weather[0].main, 'temperature': data.main.temp, 'humidity': data.main.humidity });
        });
        incomingMessage.on('error', (err) => {
            console.log(err.message);
        });
    });
});
//# sourceMappingURL=emissions.js.map