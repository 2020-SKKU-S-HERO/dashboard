import * as express from "express";

const router: express.Router = express.Router();
export { router as status };

router.get('/', (req, res): void => {
    res.render("status/status.html");
});