import express from 'express';
import ValidacaoLogin from "../middlewares/validations/Login.validation.js";
import ValidacaoCadastroUsuario from "../middlewares/validations/CadastroUsuario.validation.js";
import middlewareLimitRate from "../middlewares/LimitRate.middleware.js";
import middlewareAcessToken from "../middlewares/Acesstoken.middleware.js";
import { login, cadastro, logoff } from "../controllers/Login.controller.js";

var router = express.Router();

router.post('/', middlewareLimitRate, ValidacaoLogin, login);

router.post('/Cadastro', middlewareLimitRate, ValidacaoCadastroUsuario, cadastro);

router.delete('/LogOff', middlewareLimitRate, middlewareAcessToken, logoff);

export default router;
