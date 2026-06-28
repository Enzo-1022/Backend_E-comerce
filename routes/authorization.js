import express from "express";
import middlewareSessao from "../middlewares/middlewareSessao.js";
import AttAcessToken from "../controllers/controllerAuthorization.js";
import middlewareLimitRate from "../middlewares/middlewareLimitRate.js";

var router = express.Router();

router.get('/AttAcessToken', middlewareLimitRate, middlewareSessao, AttAcessToken);

export default router;
