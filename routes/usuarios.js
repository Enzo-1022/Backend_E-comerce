// var express = require('express'); // Criando uma instancia do Express
// var controllerUsuarios = require('../controllers/controllerUsuarios'); // Importando o Controller dos Usuarios
// var middlewareSessao = require('../middlewares/middlewareSessao.js'); // Importando o Middleware de autenticação das sessões

import express from 'express'
var router = express.Router(); // instanciando o objeto router

import {perfilUsuario, catalogo, AttInfosUsuario, desativaUsuario} from '../controllers/controllerUsuarios.js';

import middlewareSessao from '../middlewares/middlewareSessao.js'

/* 
  Criando as Rotas e dando a elas suas devidas funções tanto de callback a middlewares 

  .get define uma rota que escuta a requisições de método get

  '/catalogo' esse primeiro argumanto passado na definição das rotas, é a definição da url das rotas 
  middlewareSessao é a função de middleware que passamos
  ja o controllerUsuarios.catalogo é a função de callback
*/
router.get('/Catalogo', middlewareSessao, catalogo);

router.get('/Perfil', middlewareSessao, perfilUsuario); // Validar

router.put('/AtualizarDados', middlewareSessao, AttInfosUsuario); // Validar

router.patch('/DesativarPerfil', middlewareSessao, desativaUsuario); // Validar 

export default router;
