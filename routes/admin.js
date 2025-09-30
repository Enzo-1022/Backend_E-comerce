import { Router } from 'express';

var router = Router();

import { cadastroProdutos } from '../controllers/controllerAdmin.js';

router.post('/CadastroProduto', cadastroProdutos);

export default router;