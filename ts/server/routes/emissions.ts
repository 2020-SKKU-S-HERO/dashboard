import * as express from 'express';
import { app } from '../app';
import * as db_control from '../db_control';
import { ClientRequest, IncomingMessage } from 'http';
import * as http from 'http';
import { getNowWeatherData, insertWeatherData } from '../db_control';
import * as mqtt from 'mqtt';

const router: express.Router = express.Router();
export { router as emissionsRouter };

function addCommaInNumber(num: number): string {
    const sign: string = num < 0 ? '-' : '';
    const numberStr: string = Math.abs(num).toString();
    let resultStr: string = '';
    const point: number = numberStr.length % 3;
    let pos: number = 0;
    
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

router.get('/home', (req: any, res: any): void => {
    res.render('emissions/home.html');
});

router.get('/workplace1', (req: any, res: any): void => {
    res.render('emissions/workplace1.html');
});

router.get('/workplace2', (req: any, res: any): void => {
    res.render('emissions/workplace2.html');
});

router.get('/workplace3', (req: any, res: any): void => {
    res.render('emissions/workplace3.html');
});

router.post('/todayEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getTodayEmissions(location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/thisYearEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getThisYearEmissions(location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/thisYearRemainingPermissibleEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getThisYearRemainingPermissibleEmissions(location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/todayComparedToThisMonthAverageEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getTodayRatioComparedToThisMonthAverage(location, (data: number): void => {
        res.send(data.toFixed(1) + '%');
    });
});

router.post('/theMostPastEmissionMonth', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getTheMostPastEmissionMonth(location, (data: number): void => {
        res.send(data.toString());
    });
});

router.post('/selectedMonthEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    const year: number = Number(req.body.year);
    const month: number = Number(req.body.month);
    
    db_control.getSelectedMonthEmissions(new Date(year, month - 1, 2), location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/selectedMonthComparedToLastYear', (req: any, res: any): void => {
    const location: string = req.body.location;
    const year: number = Number(req.body.year);
    const month: number = Number(req.body.month);
    const selectedMonth: Date = new Date(year, month - 1, 2);
    const lastYearSameMonth: Date = new Date(year - 1, month - 1, 2);
    
    db_control.getSelectedMonthEmissions(selectedMonth, location, (selectedMonthData: number): void => {
        db_control.getSelectedMonthEmissions(lastYearSameMonth, location, (lastYearData: number): void => {
            if (selectedMonthData !== 0 && lastYearData !== 0) {
                res.send((((selectedMonthData / lastYearData) - 1) * 100).toFixed(1) + '%');
            } else {
                res.send('-');
            }
        });
    });
});

router.post('/selectedYearEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    const year: number = Number(req.body.year);
    
    db_control.getSelectedYearEmissions(year, location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/selectedYearComparedToLastYear', (req: any, res: any): void => {
    const location: string = req.body.location;
    const year: number = Number(req.body.year);
    
    db_control.getSelectedYearEmissions(year, location, (selectedYearData: number): void => {
        db_control.getSelectedYearEmissions(year - 1, location, (lastYearData: number): void => {
            
            if (selectedYearData !== 0 && lastYearData !== 0) {
                res.send((((selectedYearData / lastYearData) - 1) * 100).toFixed(1) + '%');
            } else {
                res.send('-');
            }
        });
    });
});

router.post('/weather', (req: any, res: any): void => {
    const cityName: string = req.body.cityName;
    
    getNowWeatherData(cityName, (data: any | null): void => {
        if (data) {
            const weatherData: any = {'weather_icon': data['weather_icon'], 'temperature': data['temperature'], 'humidity' : data['humidity']};
            
            res.send(weatherData);
        } else {
            const appId: string = '70da6bb9b7ebe370c2bf958bbf0d3ba4';
            const options = {
                host: 'api.openweathermap.org',
                port: 80,
                path: `/data/2.5/weather?q=${cityName}&appid=${appId}`,
                method: 'GET'
            };
            
            http.get(options, (incomingMessage: IncomingMessage): void => {
                let resData: string = '';
        
                incomingMessage.on('data', (chunk): void => {
                    resData += chunk;
                });
        
                incomingMessage.on('end', (): void => {
                    const data: any = JSON.parse(resData);
                    const weatherDataToSave: any = {'city_name': cityName, 'weather_icon': data.weather[0].icon, 'temperature': data.main.temp, 'humidity' : data.main.humidity}
                    const weatherDataToSend: any = {'weather_icon': data.weather[0].icon, 'temperature': data.main.temp, 'humidity' : data.main.humidity};

                    insertWeatherData(weatherDataToSave);
                    res.send(weatherDataToSend);
                });
        
                incomingMessage.on('error', (err): void => {
                    console.log(err.message);
                });
            });
        }
    });
});

router.post('/mqtt', (req: any, res: any): void => {
    const host: string = '34.64.238.233';
    const mqttUri: string = `mqtt://${host}`;
    const topic: string = 'ctrl';
    
    const client: mqtt.MqttClient = mqtt.connect(mqttUri);
    
    client.on('connect', (connection: mqtt.Packet): void => {
        const workplace: string = req.body.workplace;
        const censor: string = req.body.censor;
        const power: string = req.body.power;
        
        client.publish(`${topic}/${workplace}/${censor}`, power, { qos: 0 }, (err: Error | undefined, packet: mqtt.Packet | undefined): void => {
            if (!err) {
                console.log(`Data sent to ${topic}/${workplace}/${censor} -- ${power}`);
            }
            
            client.end();
        });
    });
    
    res.send();
});

router.post('/thisYearPredictionEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getThisYearPredictionEmissions(location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});