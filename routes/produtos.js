import { Router } from "express";
import middlewareSessao from "../middlewares/middlewareSessao.js";
import validacaoIdProduto from "../middlewares/validations/validacaoIdProduto.js";
import ValidacaoNumPagina from "../middlewares/validations/validacaoNumPagina.js";
import { catalogo, produto } from "../controllers/controllerProdutos.js";

var router = new Router();

router.get('/catalogo', middlewareSessao, ValidacaoNumPagina, catalogo); // Validar

router.get('/:Id_Produto', middlewareSessao, validacaoIdProduto, produto); // Feito 14/03/2026, Falta Validar.

export default router;
