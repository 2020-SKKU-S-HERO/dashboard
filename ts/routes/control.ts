import * as express from "express";

const router: express.Router = express.Router();
export { router as controlRouter };

router.get('/', (req, res): void => {
    res.render("control.html");
});