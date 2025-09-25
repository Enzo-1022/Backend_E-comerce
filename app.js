// Importações das Libs usadas
var express = require('express');
var path = require('path'); // Importando a lib path para trabalharmos com os arquivos
var cookieParser = require('cookie-parser'); // essa Lib é usada para preencher os headers das requisições automaticamente
var logger = require('morgan'); // Não sei

var cors = require('cors'); // Ultilizamos o cors para permitir solicitações de outros "URLS" para nosso servidor

// Importando as rotas
var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');

// Instaciando o objeto express  para setarmos as rotas e os midlewares, dps o exportamos para o arquivo bin/www nele é aonde o server é configurado e ligado
var app = express();

// Setando os midlewares
app.use(cors({
    origin : 'http://localhost:3000', // Aqui vc pode colocar o dominio que vai acessar sua api
    credentials : true, // Isso é necessario para habilitar o uso de cookies, ceredntial é oque permite o uso de cookies
    methods : ['GET', 'POST', 'PUT', 'DELETE'], // Aqui vc pode colocar os metodos que sua api vai aceitar
})); // Aqui estamos setando a biblioteca cors para que o Express possa usa-la

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);
app.use('/Usuarios', usuariosRouter);
app.use('/Login', loginRouter);
app.use('/Admin', adminRouter);

module.exports = app; // Exportando a instancia do app
