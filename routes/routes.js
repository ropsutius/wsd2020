import {Router} from "../deps.js";
import * as monitorApi from "./apis/monitorApi.js";
import * as monitorController from "./controllers/monitorController.js";

const router = new Router();

router.get("/", monitorController.getIndex);
router.get("/behavior/reporting", monitorController.getReporting);
router.get("/behavior/summary", monitorController.getSummary);
router.post("/behavior/reporting/morning", monitorController.postMorningReport);
router.post("/behavior/reporting/evening", monitorController.postEveningReport);

export {router};
