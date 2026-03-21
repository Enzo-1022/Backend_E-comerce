import express from 'express';

var router = express.Router(); // instanciando o objeto router

import {perfilUsuario, AttInfosUsuario, desativaUsuario, ativarUsuario} from '../controllers/controllerUsuarios.js';

import middlewareSessao from '../middlewares/middlewareSessao.js'

/* 
  Criando as Rotas e dando a elas suas devidas funções tanto de callback a middlewares 

  .get define uma rota que escuta a requisições de método get

  '/catalogo' esse primeiro argumanto passado na definição das rotas, é a definição da url das rotas 
  middlewareSessao é a função de middleware que passamos
  ja o controllerUsuarios.catalogo é a função de callback
*/

router.get('/Perfil', middlewareSessao, perfilUsuario); // Validar

router.put('/AtualizarDados', middlewareSessao, AttInfosUsuario); // Validar

router.patch('/DesativarPerfil', middlewareSessao, desativaUsuario); // Validado 11/03/2026

router.patch('/AtivarPerfil', middlewareSessao, ativarUsuario); // Feito 12/03/2026 falta validar

export default router;
