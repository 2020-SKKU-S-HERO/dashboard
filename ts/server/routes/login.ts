import * as express from 'express';

const router: express.Router = express.Router();
export { router as loginRouter };

router.use('/css', express.static('css'));
router.use('/images', express.static('images'));
router.use('/js', express.static('js'));
router.use('/fonts', express.static('fonts'));

router.get('/', (req: any, res: any): void => {
    res.render('login.html');
});

router.post('/', (req: any, res: any): void => {

});