import * as express from "express";

const router: express.Router = express.Router();
export { router as dashboardRouter };

router.get('/', (req, res): void => {
    res.render("dashboard.html");
});