"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emissionsRouter = void 0;
const express = require("express");
const db_control = require("../db_control");
const http = require("http");
const db_control_1 = require("../db_control");
const mqtt = require("mqtt");
const router = express.Router();
exports.emissionsRouter = router;
let censorStatus = {
    location1: {
        location: '병점',
        mainMotorStatus: false,
        subMotorStatus: false
    },
    location2: {
        location: '수원',
        mainMotorStatus: false,
        subMotorStatus: false
    },
    location3: {
        location: '인천',
        mainMotorStatus: false,
        subMotorStatus: false
    }
};
let mainMotorStatus = false;
let subMotorStatus = false;
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
        res.send(data.toString());
    });
});
router.post('/thisYearEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getThisYearEmissions(location, (data) => {
        res.send(data.toString());
    });
});
router.post('/thisYearRemainingPermissibleEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getThisYearPermissibleEmissions((permissibleEmissions) => {
        db_control.getThisYearEmissions(location, (emissions) => {
            res.send((permissibleEmissions - emissions).toString());
        });
    });
});
router.post('/todayComparedToThisMonthAverageEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getTodayRatioComparedToThisMonthAverage(location, (data) => {
        res.send(data.toString());
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
        res.send(data.toString());
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
                res.send((((selectedMonthData / lastYearData) - 1) * 100).toString());
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
        res.send(data.toString());
    });
});
router.post('/selectedYearComparedToLastYear', (req, res) => {
    const location = req.body.location;
    const year = Number(req.body.year);
    db_control.getSelectedYearEmissions(year, location, (selectedYearData) => {
        db_control.getSelectedYearEmissions(year - 1, location, (lastYearData) => {
            if (selectedYearData !== 0 && lastYearData !== 0) {
                res.send((((selectedYearData / lastYearData) - 1) * 100).toString());
            }
            else {
                res.send('-');
            }
        });
    });
});
router.post('/weather', (req, res) => {
    const cityName = req.body.cityName;
    db_control_1.getNowWeatherData(cityName, (data) => {
        if (data) {
            const weatherData = {
                'weather_icon': data['weather_icon'],
                'temperature': data['temperature'],
                'humidity': data['humidity']
            };
            res.send(weatherData);
        }
        else {
            const appId = '70da6bb9b7ebe370c2bf958bbf0d3ba4';
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
                    const weatherDataToSave = {
                        'city_name': cityName,
                        'weather_icon': data.weather[0].icon,
                        'temperature': data.main.temp,
                        'humidity': data.main.humidity
                    };
                    const weatherDataToSend = {
                        'weather_icon': data.weather[0].icon,
                        'temperature': data.main.temp,
                        'humidity': data.main.humidity
                    };
                    db_control_1.insertWeatherData(weatherDataToSave);
                    res.send(weatherDataToSend);
                });
                incomingMessage.on('error', (err) => {
                    console.log(err.message);
                });
            });
        }
    });
});
router.post('/mqtt', (req, res) => {
    const host = '34.64.238.233';
    const mqttUri = `mqtt://${host}`;
    const topic = 'ctrl';
    const client = mqtt.connect(mqttUri);
    client.on('connect', (connection) => {
        const workplace = req.body.workplace;
        const censor = req.body.censor;
        const power = req.body.power;
        let censorStatusInLocation = null;
        switch (workplace) {
            case censorStatus.location1.location:
                censorStatusInLocation = censorStatus.location1;
                break;
            case censorStatus.location2.location:
                censorStatusInLocation = censorStatus.location2;
                break;
            case censorStatus.location3.location:
                censorStatusInLocation = censorStatus.location3;
                break;
        }
        if (censorStatusInLocation) {
            if (censor === 'main') {
                if (power === 'on') {
                    censorStatusInLocation.mainMotorStatus = true;
                }
                else if (power === 'off') {
                    censorStatusInLocation.mainMotorStatus = false;
                }
            }
            else if (censor === 'sub') {
                if (power === 'on') {
                    censorStatusInLocation.subMotorStatus = true;
                }
                else if (power === 'off') {
                    censorStatusInLocation.subMotorStatus = false;
                }
            }
        }
        client.publish(`${topic}/${workplace}/${censor}`, power, { qos: 0 }, (err, packet) => {
            if (!err) {
                console.log(`Data sent to ${topic}/${workplace}/${censor} -- ${power}`);
            }
            client.end();
        });
    });
    res.send();
});
router.post('/thisYearPredictionEmissions', (req, res) => {
    const location = req.body.location;
    db_control.getThisYearPredictionEmissions(location, (data) => {
        res.send(data.toString());
    });
});
router.post('/censorStatus', (req, res) => {
    const workplace = req.body.workplace;
    let censorStatusInLocation = null;
    switch (workplace) {
        case censorStatus.location1.location:
            censorStatusInLocation = censorStatus.location1;
            break;
        case censorStatus.location2.location:
            censorStatusInLocation = censorStatus.location2;
            break;
        case censorStatus.location3.location:
            censorStatusInLocation = censorStatus.location3;
            break;
    }
    if (censorStatusInLocation) {
        res.send({ 'main': censorStatusInLocation.mainMotorStatus, 'sub': censorStatusInLocation.subMotorStatus });
    }
});
router.post('/predictionAverageError', (req, res) => {
    const location = req.body.location;
    db_control_1.getPredictionAverageError(location, (data) => {
        res.send(data.toString());
    });
});
router.post('/resourceRatio', (req, res) => {
    const location = req.body.location;
    db_control_1.getResourceRatio(location, (data) => {
        res.send(data);
    });
});
//# sourceMappingURL=emissions.js.map