import express from 'express';
import ValidacaoLogin from "../middlewares/validations/validacaoLogin.js";
import ValidacaoCadastroUsuario from "../middlewares/validations/validacaoCadastroUsuario.js";
import middlewareLimitRate from "../middlewares/middlewareLimitRate.js";

var router = express.Router();

import {login, cadastro} from "../controllers/controllerLogin.js"

router.post('/', middlewareLimitRate, ValidacaoLogin, login);

router.post('/Cadastro', middlewareLimitRate, ValidacaoCadastroUsuario, cadastro);

export default router;
