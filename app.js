import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan'

import cors from 'cors';

import usuarios from './routes/usuarios.js';
import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';
import adminRouter from './routes/admin.js';

// const __dirname = path.dirname(__filename);

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
// app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);
app.use('/Usuarios', usuarios);
app.use('/Login', loginRouter);
app.use('/Admin', adminRouter);

export default app;
