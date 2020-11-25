import {Router} from "../deps.js";
import * as monitorApi from "./apis/monitorApi.js";
import * as monitorController from "./controllers/monitorController.js";

const router = new Router();

router.get("/", monitorController.getLanding);
router.get("/behavior/reporting", monitorController.getReporting);
router.post("/behavior/reporting/morning", monitorController.postMorningReport);

export {router};
