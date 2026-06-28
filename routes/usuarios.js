import express from "express";

var router = express.Router(); // instanciando o objeto router

import {perfilUsuario, attUsuario, desativaUsuario, ativarUsuario} from "../controllers/controllerUsuarios.js";

import middlewareAcessToken from "../middlewares/middlewareAcesstoken.js";

import ValidacaoIdUsuario from "../middlewares/validations/validacaoIdUsuario.js";

import ValidacaoAttInfosUsuario from "../middlewares/validations/validacaoAttInfosUsuario.js";

import middlewareLimitRate from "../middlewares/middlewareLimitRate.js";

/* 
  Criando as Rotas e dando a elas suas devidas funções tanto de callback a middlewares 

  .get define uma rota que escuta a requisições de método get

  '/catalogo' esse primeiro argumanto passado na definição das rotas, é a definição da url das rotas 
  middlewareSessao é a função de middleware que passamos
  ja o controllerUsuarios.catalogo é a função de callback
*/

router.get('/Perfil', middlewareLimitRate, middlewareAcessToken, perfilUsuario); // Validar

router.put('/AtualizarDados', middlewareLimitRate, middlewareAcessToken, ValidacaoAttInfosUsuario, attUsuario); // Validar

router.patch('/DesativarPerfil', middlewareLimitRate, middlewareAcessToken, desativaUsuario); // Validado 11/03/2026

router.patch('/AtivarPerfil/:Id_Usuario', middlewareLimitRate, ValidacaoIdUsuario, ativarUsuario); // Feito 12/03/2026 falta validar

export default router;
