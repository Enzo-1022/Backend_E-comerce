import { Router } from 'express';
import validacaoIdProduto from '../middlewares/validations/validacaoIdProduto.js';
import { cadastroProdutos, AtualizandoProduto } from '../controllers/controllerAdmin.js';

var router = Router(); // Instanciando o modulo de Router do Express para gerenciamento/criação das rotas da aplicação

router.post('/CadastroProduto', cadastroProdutos);

router.put('/AtualizacaoProduto/:Id_Produto', validacaoIdProduto, AtualizandoProduto); // Criado 12/03/2026, Falta Validar

export default router;
