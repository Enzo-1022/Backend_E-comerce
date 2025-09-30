// var express = require('express');
import express from 'express';
var router = express.Router();

// var controllerLogin = require('../controllers/controllerLogin');

import {Login, Cadastro} from '../controllers/controllerLogin.js'

router.post('/', Login);

router.post('/Cadastro', Cadastro);

// module.exports = router;

export default router;
