/*
    Importando os modelos
*/
import Usuarios from '../models/mUsuarios.js'; // Modelo de usuarios
import Logins from '../models/mLogins.js'; // Modelo de logins
import { validationResult, body } from 'express-validator';
import Sessoes from '../models/mSessoes.js'; // Modelo de sessôes

import jwt from 'jsonwebtoken';

import 'dotenv/config';

const SessionPasword = process.env.PasswordSession;


export const Cadastro = [ // Callback para cadastrar um novo usuario
    // Função refatotorada e melhorada 16/09/2025
    // Refatorei ja no novo padrao que aprendi sobre api rest, usando os codigos de status http

    body('Email').trim().escape().notEmpty(),
    body('Senha').trim().escape().notEmpty(),
    body('Cpf').trim().escape().notEmpty(),
    body('Data_Nascimento').trim().escape().notEmpty(),
    body('Nome').trim().escape().notEmpty(),

    async (req, res, next) => {

        try {
            var errors = validationResult(req);

            if (!errors.isEmpty()) 
            {
                return res.status(400).json({Erro: "Dados Invalidos!"});
            } 
            else 
            {
                const verificaUsuExistemte = JSON.parse(JSON.stringify(await Logins.findAll({
                    where : { Email : req.body.Email }
                })));

                if (verificaUsuExistemte.length) {
                    return res.status(409).json({Erro : "Conflito! um mesmo usuario já cadastrado com o mesmo email."})
                }
                else
                {
                    const novoUsuario = await Usuarios.create({
                        Nome : req.body.Nome,
                        Data_Nascimento : req.body.Data_Nascimento,
                        Cpf : req.body.Cpf
                    });

                    const novoLogin = await Logins.create({
                        Id_Usuario : novoUsuario.Id_Usuario,
                        Email : req.body.Email,
                        Senha : req.body.Senha,
                        Administrador : false
                    });

                    if (!novoUsuario || !novoLogin) {
                        return res.status(500).json({Erro : "Erro Interno do Servidor, não foi possivel cadastrar o novo usuario."})
                    }

                    return res.status(201).json({Resultado : "ok"}); // Repondendo a requisição com um status 201, informando que foi criado com sucesso o novo usuario.
                }
            }
        } catch (error) {
            res.status(500).json({Erro : `Erro Interno do Servidor, ${error}`})
        }
    }
];

export const Login = [

    body('Email').trim().escape().notEmpty(),
    body('Senha').trim().escape().notEmpty(),

    async (req, res, next) => {
        try {
            var errors = validationResult(req);

            if (!errors.isEmpty()) 
            {
                return res.status(400).json({
                    Erro:  "Conflito! Dados Invalidos."
                });
            }
            else
            {
                var login = JSON.parse(JSON.stringify( // Busca o login do usuario no banco de dados se não houver retorna um array vazio
                    await Logins.findAll({
                        where : {
                            Email : req.body.Email
                        }
                    })
                ));

                var sessaoAtiva = JSON.parse(JSON.stringify( await Sessoes.findAll({ // Buscando se já existe uma sessão ativa para o usuario que está tentando logar
                    where : {
                        Id_Usuario : login[0].Id_Usuario
                    }
                })));

                if (!login.length) // Se a variavel login for uma array vazia significa que não existe um usuario cadastrado com aquele email e logo entra no if e retorna a resposta a requisição com o status 401 não autorizado
                {
                    return res.status(401).json({
                        Erro : "Não Autorizado! Email não cadastrado!"
                    });
                }
                else if (login[0].Senha !== req.body.Senha) // se o emial for valido ele verifica para saber se a senha digitada está igual a cadastrada, se for diferente ele envia a resposta a requisição com um status de 401 não autorizado.
                {
                    return res.status(401).json({
                        Erro : "Não Autorizado! Senha incorreta!"
                    });
                }
                else // se tudo estiver certo o servidor gera um cookie de seção, ainda preciso criar uma tabela  para administrar-mos as seções dos usuarios, preciso criar o middleware para verificar se o id de sessão que iremos passar via cabeçalho authenticator está valido ou não e buscar uma biblioteca para gerar os tokens de sessão.
                {
                    if (sessaoAtiva.length) { // Se já houver uma sessão ativa para o usuario, deletamos ela para criar uma nova
                        await Sessoes.destroy({
                            where : {
                                Id_Usuario : login[0].Id_Usuario
                            }
                        });
                    }

                    const novaSessao = await Sessoes.create({ // Criando um novo registro de sessão no banco de dados
                        Id_Usuario : login[0].Id_Usuario,
                        Token : jwt.sign({ Id_Usuario : login[0].Id_Usuario }, SessionPasword, { expiresIn : '1h' }) // Criando o token de sessão com JWT
                    });

                    res.cookie('sessionToken', novaSessao.toJSON().Token, {
                        path : '/', // Torna o Cookie acessivel em toda a aplicação 
                        secure : false, //Isso faz com que o cookie so seja enviado atraves de uma requisição https, se true, se false o cookie pode ser enviado vi http
                        httpOnly : false, //Dps nos muda para true pois isso evita que o cookie seja acessivel via JS
                        sameSite : 'lax',
                    });

                    return res.status(200).json({
                        Mensagem : "Logado com Sucesso! Sessão criada com sucesso!"
                    });
                }
            }
        } catch (error) {
            return res.status(500).json({
                Erro : `Erro interno do servidor! Tente novamente, se o erro persistir, contate o administrador do sistema! ${error}`
            });
        }
    }
];

// Comecei a refatorar o callback de login, preciso testa-lo e revisa-lo, Também preciso fazer o middleware para controle de sessão. Repensar a lógica para ver se toda vez que o usuario entrar na tela de login, o callback irá verificar sua sessão ou somente o middleware.
// 18/09/2025 comecei a fazer o envio do cookie de sessão para o front, falta mudaar a api par https junto com o front para que o cookie de seessaõ seja acessivel em toda a aplicação.
// 23/09/2025 - Terminei o callback de login, agora falta fazer o middleware para verificar se o token de sessão é valido ou não.