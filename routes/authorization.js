import express from "express";
import middlewareSessao from "../middlewares/middlewareSessao.js";
import { AttAcessToken } from "../controllers/controllerAuthorization.js";

var router = express.Router();

router.get('/AttAcessToken', middlewareSessao, AttAcessToken, (req, res, next) => {
    res.status(200).json('tese')
});

export default router;
