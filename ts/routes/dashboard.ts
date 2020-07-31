import * as express from "express";

const router: express.Router = express.Router();
export { router as dashboardRouter };

router.get('/', (req: any, res: any): void => {
    res.render("dashboard/home.html");
});