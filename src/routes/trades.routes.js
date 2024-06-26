import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {updloadcsvtomongodb,getAssestBalancedata } from "../controllers/trade.controller.js";

const router = Router();

router.route("/").post(upload.single("file"),updloadcsvtomongodb);
router.route("/balance").get(getAssestBalancedata);

export default router;