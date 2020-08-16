import * as express from 'express';
import { app } from '../app';
import * as db_control from '../db_control';

const router: express.Router = express.Router();
export { router as emissionsRouter };

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

router.get('/home/todayEmissions', (req: any, res: any): void => {
    db_control.getTodayEmissions((results: any): void => {
        res.send(results[0]);
    });
});