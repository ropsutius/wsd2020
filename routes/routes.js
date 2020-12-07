import { Router } from "../deps.js";
import * as monitorApi from "./apis/monitorApi.js";
import * as monitorController from "./controllers/monitorController.js";
import * as authController from "./controllers/authController.js";

const router = new Router();

router.get("/", monitorController.getIndex);

router.get("/behavior/reporting", monitorController.getReporting);
router.get("/behavior/summary", monitorController.getSummary);
router.post("/behavior/reporting/morning", monitorController.postMorningReport);
router.post("/behavior/reporting/evening", monitorController.postEveningReport);

router.get("/auth/register", authController.getRegister);
router.post("/auth/register", authController.postRegister);
router.get("/auth/login", authController.getLogin);
router.post("/auth/login", authController.postLogin);
router.get("/auth/logout", authController.logout);

export { router };
