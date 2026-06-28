import { Router } from "express";
import middlewareAcessToken from '../middlewares/middlewareAcesstoken.js'
import validacaoIdProduto from "../middlewares/validations/validacaoIdProduto.js";
import ValidacaoNumPagina from "../middlewares/validations/validacaoNumPagina.js";
import { catalogo, produto } from "../controllers/controllerProdutos.js";
import middlewareLimitRate from "../middlewares/middlewareLimitRate.js"

var router = new Router();

router.get('/catalogo', middlewareLimitRate, middlewareAcessToken, ValidacaoNumPagina, catalogo); // Validar

router.get('/:Id_Produto', middlewareLimitRate, middlewareAcessToken, validacaoIdProduto, produto); // Feito 14/03/2026, Falta Validar.

export default router;
