import * as express from "express";

const router: express.Router = express.Router();
export { router as admin };

router.get('/', (req, res): void => {
    res.send("admin app");
});