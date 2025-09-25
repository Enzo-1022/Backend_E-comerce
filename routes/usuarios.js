var express = require('express');
var router = express.Router();
var controllerUsuarios = require('../controllers/controllerUsuarios');

var middlewareSessao = require('../middlewares/middlewareSessao.js');

/* GET users listing. */
router.get('/', middlewareSessao.middlewareSessao, function(req, res, next) {
  res.send({ "Resposta" : 'respond with a resource'});
});

router.get('/Catalogo', controllerUsuarios.catalogo);

module.exports = router;
