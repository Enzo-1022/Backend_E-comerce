import { Router } from "express";
import middlewareAcessToken from '../middlewares/Acesstoken.middleware.js'
import validacaoIdProduto from "../middlewares/validations/IdProduto.validation.js";
import ValidacaoNumPagina from "../middlewares/validations/NumPagina.validation.js";
import { catalogo, produto } from "../controllers/Produtos.controller.js";
import middlewareLimitRate from "../middlewares/LimitRate.middleware.js";

var router = new Router();

router.post('/catalogo', middlewareLimitRate, middlewareAcessToken, ValidacaoNumPagina, catalogo); // Validar

router.get('/:Id_Produto', middlewareLimitRate, middlewareAcessToken, validacaoIdProduto, produto); // Feito 14/03/2026, Falta Validar.

export default router;
