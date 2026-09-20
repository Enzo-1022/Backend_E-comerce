import express from "express";
import middlewareAcessToken from "../middlewares/Acesstoken.middleware.js";
import ValidacaoIdProduto from "../middlewares/validations/IdProduto.validation.js";
import ValidacaoAttInfosProdutos from "../middlewares/validations/AttInfosProduto.validation.js";
import { cadastroProdutos, atualizandoProduto } from "../controllers/Admin.controller.js";
import middlewareAcessAdminRoute from "../middlewares/AcessAdminRoute.middleware.js";
import middlewareLimitRate from "../middlewares/LimitRate.middleware.js";

var router = express.Router(); // Instanciando o modulo de Router do Express para gerenciamento/criação das rotas da aplicação

router.post('/CadastroProduto', middlewareLimitRate, middlewareAcessToken, middlewareAcessAdminRoute, ValidacaoAttInfosProdutos, cadastroProdutos);

router.put('/AtualizacaoProduto/:Id_Produto', middlewareLimitRate, middlewareAcessToken, middlewareAcessAdminRoute, ValidacaoIdProduto, ValidacaoAttInfosProdutos, atualizandoProduto); // Criado 12/03/2026, Falta Validar

export default router;
