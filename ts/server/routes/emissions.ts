import * as express from 'express';
import { app } from '../app';
import * as db_control from '../db_control';

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

router.post('/home/todayEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getTodayEmissions(location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/home/thisYearEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getThisYearEmissions(location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/home/thisYearRemainingPermissibleEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getThisYearRemainingPermissibleEmissions(location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/home/todayComparedToThisMonthAverageEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getTodayRatioComparedToThisMonthAverage(location, (data: number): void => {
        res.send(data.toFixed(1) + '%');
    });
});

router.post('/home/theMostPastEmissionMonth', (req: any, res: any): void => {
    const location: string = req.body.location;
    
    db_control.getTheMostPastEmissionMonth(location, (data: number): void => {
        res.send(data);
    });
});

router.post('/home/selectedMonthEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    const year: number = Number(req.body.year);
    const month: number = Number(req.body.month);
    
    db_control.getSelectedMonthEmissions(new Date(year, month - 1, 2), location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/home/selectedMonthComparedToLastYear', (req: any, res: any): void => {
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

router.post('/home/selectedYearEmissions', (req: any, res: any): void => {
    const location: string = req.body.location;
    const year: number = Number(req.body.year);
    
    db_control.getSelectedYearEmissions(year, location, (data: number): void => {
        res.send(addCommaInNumber(data) + 't');
    });
});

router.post('/home/selectedYearComparedToLastYear', (req: any, res: any): void => {
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

