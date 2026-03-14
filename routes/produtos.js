import { Router } from "express";
import middlewareSessao from "../middlewares/middlewareSessao.js";
import validacaoIdProduto from "../middlewares/validations/validacaoIdProduto.js";
import { catalogo, produto } from "../controllers/controllerProdutos.js";

const router = new Router();

router.get('/catalogo', middlewareSessao, catalogo);

router.get('/:Id_Produto', middlewareSessao, validacaoIdProduto, produto); // Feito 14/03/2026, Falta Validar.
