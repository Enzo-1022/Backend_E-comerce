import express from "express";
import middlewareAcessToken from "../middlewares/middlewareAcesstoken.js";
import ValidacaoIdProduto from "../middlewares/validations/validacaoIdProduto.js";
import ValidacaoAttInfosProdutos from "../middlewares/validations/validacaoAttInfosProduto.js";
import { cadastroProdutos, atualizandoProduto } from "../controllers/controllerAdmin.js";
import middlewareAcessAdminRoute from "../middlewares/middlewareAcessAdminRoute.js";
import middlewareLimitRate from "../middlewares/middlewareLimitRate.js"

var router = express.Router(); // Instanciando o modulo de Router do Express para gerenciamento/criação das rotas da aplicação

router.post('/CadastroProduto', middlewareLimitRate, middlewareAcessToken, middlewareAcessAdminRoute, ValidacaoAttInfosProdutos, cadastroProdutos);

router.put('/AtualizacaoProduto/:Id_Produto', middlewareLimitRate, middlewareAcessToken, middlewareAcessAdminRoute, ValidacaoIdProduto, ValidacaoAttInfosProdutos, atualizandoProduto); // Criado 12/03/2026, Falta Validar

export default router;
