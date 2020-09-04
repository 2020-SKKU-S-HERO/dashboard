import * as express from 'express';
import { insertResourceInput } from "../db_control";

const router: express.Router = express.Router();
export { router as dataInputRouter };

router.use('/css', express.static('css'));
router.use('/images', express.static('images'));
router.use('/js', express.static('js'));
router.use('/fonts', express.static('fonts'));

router.get('/', (req: any, res: any): void => {
    res.render('datainput/home.html');
});

router.post('/', (req: any, res: any) => {
    const body: any = req.body;
    const resourceData: any = {
        'location': body.location,
        'limestone': body.limestone,
        'clay': body.clay,
        'silicaStone': body.silicaStone,
        'ironOxide': body.ironOxide,
        'gypsum': body.gypsum,
        'coal': body.coal
    };
    
    insertResourceInput(resourceData, (): void => {});
    res.render('datainput/home.html');
});