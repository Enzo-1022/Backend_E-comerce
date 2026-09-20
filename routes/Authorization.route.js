import express from "express";
import middlewareSessao from "../middlewares/Sessao.middleware.js";
import AttAcessToken from "../controllers/Authorization.controller.js";
import middlewareLimitRate from "../middlewares/LimitRate.middleware.js";

var router = express.Router();

router.get('/AttAcessToken', middlewareLimitRate, middlewareSessao, AttAcessToken);

export default router;
