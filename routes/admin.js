var express = require('express');

var router = express.Router();

var controllerAdmin = require('../controllers/controllerAdmin');

router.post('/CadastroProduto', controllerAdmin.cadastroProdutos);

module.exports = router;