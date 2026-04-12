import { Router, type IRouter } from "express";
import healthRouter from "./health";
import articlesRouter from "./articles";
import categoriesRouter from "./categories";
import adminRouter from "./admin";
import epapersRouter from "./epapers";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/articles", articlesRouter);
router.use("/categories", categoriesRouter);
router.use("/admin", adminRouter);
router.use("/epapers", epapersRouter);
router.use(storageRouter);

export default router;
