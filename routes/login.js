var express = require('express');

var router = express.Router();

var controllerLogin = require('../controllers/controllerLogin');

router.post('/', controllerLogin.Login);

router.post('/Cadastro', controllerLogin.Cadastro);

module.exports = router;
