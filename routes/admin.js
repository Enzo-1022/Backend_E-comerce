import { Router } from 'express';
import middlewareSessao from '../middlewares/middlewareSessao.js';
import validacaoIdProduto from '../middlewares/validations/validacaoIdProduto.js';
import { CadastroProdutos, AtualizandoProduto } from '../controllers/controllerAdmin.js';

var router = Router(); // Instanciando o modulo de Router do Express para gerenciamento/criação das rotas da aplicação

router.post('/CadastroProduto', middlewareSessao, CadastroProdutos);

router.put('/AtualizacaoProduto/:Id_Produto', middlewareSessao, validacaoIdProduto, AtualizandoProduto); // Criado 12/03/2026, Falta Validar

export default router;
