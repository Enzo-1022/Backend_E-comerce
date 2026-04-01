import express from 'express';
import ValidacaoLogin from '../middlewares/validations/validacaoLogin.js';
import ValidacaoCadastroUsuario from '../middlewares/validations/validacaoCadastroUsuario.js';

var router = express.Router();

import {login, cadastro} from '../controllers/controllerLogin.js'

router.post('/', ValidacaoLogin, login);

router.post('/Cadastro', ValidacaoCadastroUsuario, cadastro);

export default router;
