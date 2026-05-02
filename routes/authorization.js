import { Router } from "express";
import { middlewareSessao } from "../middlewares/middlewareSessao.js";
import { AttAcessToken } from "../controllers/controllerAuthorization.js";

var router = Router();

router.get('/AttAcessToken', middlewareSessao(), AttAcessToken());
