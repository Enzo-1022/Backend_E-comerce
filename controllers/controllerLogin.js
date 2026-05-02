/*
    Importando os modelos
*/
import Usuarios from '../models/mUsuarios.js'; // Modelo de usuarios
import Logins from '../models/mLogins.js'; // Modelo de logins
import { validationResult, body } from 'express-validator';
import mSessoes from '../models/mSessoes.js'; // Modelo de sessôes
import Sessoes from '../Services/sessoes.js';

import jwt from 'jsonwebtoken';

import 'dotenv/config';

import { Hashing } from '../Services/hasing.js'; // Importa

const SessionPasword = process.env.PasswordSession;

// Adicionar uma validação para caso ocorrer erro em alguma função que faça a inserção no banco, apagar oq ja tinha sido inserido e vise e versa.
// Callback para cadastrar um novo usuario
// Função refatotorada e melhorada 16/09/2025
// Refatorei ja no novo padrao que aprendi sobre api rest, usando os codigos de status http
// Mais Melhorias 01/05/2026, Adicionada a verificação se existe um usuário ja cadastrado com o cpf informado no cadastro
// Validar DPS 01/05/2026.

export async function cadastro (req, res) { // Um novo padrão a se seguir eliminando os blocos else 
    try {
        const VerificaCpf = await Usuarios.count(
            {
                where : {
                    Cpf : req.Cpf
                }
            }
        );

        if (VerificaCpf) {
            return res.status(409).json({Erro : "Ja existe um Usuário Cadastrado para o Cpf informado."})
        }

        const VerificaUsuExistente = await Logins.count(
            {
                where : { 
                    Email : req.Email 
                }
            }
        );

        if (VerificaUsuExistente) {
            return res.status(409).json({Erro : "Conflito! um mesmo usuario já cadastrado com o mesmo email."});
        }

        const NovoUsuario = await Usuarios.create(
            {
                Nome : req.Nome,
                Data_Nascimento : req.Data_Nascimento,
                Cpf : req.Cpf
            }
        );

        const novoLogin = await Logins.create(
            {
                Id_Usuario : NovoUsuario.Id_Usuario,
                Email : req.Email,
                Senha : await Hashing.criandoHash(req.Senha),
                Admin : false,
                ativo: true
            }
        );

        return res.status(201).end(); // Repondendo a requisição com um status 201, informando que foi criado com sucesso o novo usuario.

    } catch (error) { // Existe um erro de usabilidade: caso aconteça algum erro durante a execução do segundo registro (O de Login, que cria o login para que o usuário possa se autenticar e entrar na aplicação) no banco de dados, o usuário terá seu cadastro na tabela de usuários registrado mas na de login não, assim o usuário não consegue se cadastrar dnv pois o seu cpf ja está cadastrado mas tbm não consegue fazer o login pois não há o seu registro dentro da tabela de logins, pensar em uma solução para esse erro 
        res.status(500).json({Erro : `Erro Interno do Servidor, ${error}`});
    }
};

// Melhorias no Sistema de Login com os Token de Sessão e de Acesso 01/05/2026, Passei a criação dos códigos para uma classe em um arquivo separado e adicionei a criação e o envio do acess token ao realizar o login agr contamos com dois tokens de autenticação, o de sessão e o de acesso.
export async function login(req, res) {
    try {
        const Login = await Logins.findAll(
            {
                where : {
                    Email : req.body.Email
                },
                raw : true // Utilizando o método raw como true o sequelize nos traz apenas os dados buscados diretamente do banco sem os metadados que o sequelize traz com o findall com raw: false
            }
        );
        
        if (!Login.length) { // Se a variavel login for uma array vazia significa que não existe um usuario cadastrado com aquele email e logo entra no if e retorna a resposta a requisição com o status 401 não autorizado
            return res.status(404).json({
                Erro : "Não Autorizado! Email não cadastrado!"
            });
        }

        if (!Login[0].Ativo) { // Validando se o usuário está com a conta ativa
            return res.status(403).json({Erro : "Não autorizado, Usuario desativado!", IdUsuario :  login[0].Id_Usuario});
        }
        
        if(!await Hashing.verificaHash(Login[0].Senha, req.body.Senha)) { // Verifica Senha
            return res.status(401).json({
                Erro : "Não Autorizado! Senha incorreta!"
            });
        }

        // Caso a senha todos os dados de login forem corretos podemos prossefuir para a criação dos tokens de sessão e o acess token

        // Primeiro apagamos os dados da tabela de sessão, é uma tabela que estou utilizando para guardar o token de sessao para poder compara-lo e ter mais uma referencia da sessão ao usuário
        await Sessoes.excluiSessao(Login[0].Id_Usuario); // Apagando a sessão caso o usuário possua, se não encontrar nenhum registro o sequelize não faz nada e nem gera um erro ele apenas retorna um numero inteiro que significa a quantidade de linhas afetadas pela ação.
        
        // Após apagar os dados da sessão criamos uma nova sessão.
        const CriandoSessao = await Sessoes.criaSessao(Login[0].Id_Usuario);

        // Verificamos se a Sessão foi criada com sucesso
        if (!CriandoSessao.SessaoCriada) {
            throw new Error(CriandoSessao.Sessao); // Caso a Sessão não tenha sido criada, disparamos um novo erro.
        }

        // Criando o Cookie que armazena o token de sessão.
        res.cookie(
            'sessionToken', // Definindo o nome do Cookie
            CriandoSessao.Sessao.Token, // Conteudo do Cookie, atribuindo o token de sessão para o cookie
            {
                path : '/', // Torna o Cookie acessivel em toda a aplicação 
                secure : false, //Isso faz com que o cookie so seja enviado atraves de uma requisição https, se true, se false o cookie pode ser enviado via http
                httpOnly : false, //Dps nos muda para true pois isso evita que o cookie seja acessivel via JS
                sameSite : 'lax',
            }
        );

        // Respondendo a Solicitação de Login com o token de sessão em um cookie e o acess token no body da aplicação.
        return res.status(200).json({IdUsuario : Login[0].Id_Usuario, AcessToken : Sessoes.criaAcessToken(Login[0].Id_Usuario, false)});

    } catch (error) {
        return res.status(500).json({
            Erro : `Erro interno do servidor! Tente novamente, se o erro persistir, contate o administrador do sistema! ${error}`
        });
    }
}

// Comecei a refatorar o callback de login, preciso testa-lo e revisa-lo, Também preciso fazer o middleware para controle de sessão. Repensar a lógica para ver se toda vez que o usuario entrar na tela de login, o callback irá verificar sua sessão ou somente o middleware.
// 18/09/2025 comecei a fazer o envio do cookie de sessão para o front, falta mudaar a api par https junto com o front para que o cookie de seessaõ seja acessivel em toda a aplicação.
// 23/09/2025 - Terminei o callback de login, agora falta fazer o middleware para verificar se o token de sessão é valido ou não.
// 24/04/2025 - Retirada da Lógica de criação e verificação de sessão para uma classe própria, e começo da implementação do acess token, antes só usava o token de sessão.