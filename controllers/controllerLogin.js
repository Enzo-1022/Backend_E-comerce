/*
    Importando os modelos
*/
import mUsuarios from "../models/mUsuarios.js"; // Modelo de usuarios
import mLogins from "../models/mLogins.js"; // Modelo de logins
import mSessoes from "../models/mSessoes.js"; // Modelo de sessôes
import Sessoes from "../Services/sessoes.js"; // Classe com a Lógica das Sessões

import argon2  from "argon2"; // Importando a blibioteca argon2 que estamos utilizando para fazer o hashing das senhas, aqui vamos passa-la como argumento para instanciar a classe service de hashing 

/* 
    Importando as classes de Service
*/
import sHashing from "../Services/hasing.js"; // Classe Service de Hasshing
import sUsuarios from "../Services/usuarios.js"; // Classe service Usuarios
import sLogin from "../Services/login.js"; // Classe service Logins

/* 
    Instanciando as classes de Service
*/
const Hashing = new sHashing(argon2);
const Logins = new sLogin(mLogins, Hashing);
const Usuarios = new sUsuarios(mUsuarios, Logins);

// Adicionar uma validação para caso ocorrer erro em alguma função que faça a inserção no banco, apagar oq ja tinha sido inserido e vise e versa.
export async function cadastro (req, res) { // Callback para cadastrar um novo usuario
    try {
        const VerificaCpf = await Usuarios.verificaCpf(req.Cpf);

        if (VerificaCpf) {

            req.log.error(
                {
                    Acao : "CADASTRO_USUARIO",
                    Status : 'ERRO',
                    Erro : {
                        Titulo : "Tentativa de Cadastro Negada",
                        Detalhes : "Ja existe um Usuario Cadastrado para o Cpf informado",
                        ReqID : req.id
                    }
                }
            );

            return res.status(409).json(
                {
                    Erro : {
                        Titulo : "Conflito no Cadastro (CPF)",
                        Detalhes : "Ja existe um Usuário Cadastrado para o Cpf informado."
                    }
                }
            );
        }

        const verificaEmail = await Logins.verificaEmail(req.Email);

        if (verificaEmail) {
            req.log.error(
                {
                    Acao : "CADASTRO_USUARIO",
                    Status : 'ERRO', 
                    Erro : {
                        Titulo : "Tentativa de Cadastro Negada",
                        Detalhes : `Ja existe um Usuario Cadastrado para o Email informado ${req.Email}`,
                        ReqID : req.id
                    }
                }
            );

            return res.status(409).json(
                {
                    Erro : {
                        Titulo : "Conflito no Cadastro (Email)",
                        Detalhes : "Ja Existe um Usuario Cadastrado para o Email Informado.",
                        ReqID : req.id
                    }
                }
            );
        }

        const CriandoUsuario = await Usuarios.cadastroUsuario(req.Nome, req.Data_Nascimento, req.Cpf, req.Email, req.Senha);

        req.log.info(
            {
                Acao : "CADASTRO_USUARIO", 
                Status : 'OK', 
                Detalhes : `USUARIO ID: ${CriandoUsuario.novoUsuario.Id_Usuario} Cadastrado com Sucesso`, 
                EmailUsuario : req.Email,
                ReqID : req.id
            }
        );

        return res.status(201).end(); // Repondendo a requisição com um status 201, informando que foi criado com sucesso o novo usuario.

    } catch (error) { // Existe um erro de usabilidade: caso aconteça algum erro durante a execução do segundo registro (O de Login, que cria o login para que o usuário possa se autenticar e entrar na aplicação) no banco de dados, o usuário terá seu cadastro na tabela de usuários registrado mas na de login não, assim o usuário não consegue se cadastrar dnv pois o seu cpf ja está cadastrado mas tbm não consegue fazer o login pois não há o seu registro dentro da tabela de logins, pensar em uma solução para esse erro 
        req.log.error(
            {
                Acao : "CADASTRO_USUARIO",
                Status : 'ERRO',
                Erro : {
                    Titulo : "Erro ao Realizar Cadastro",
                    Detalhes : error,
                    ReqID : req.id
                }
            }
        );

        return res.status(500).json(
            {
                Erro : {
                    Titulo : "Erro ao Realizar Cadastro",
                    Detalhes : "Erro Interno ao Realizar Cadastro",
                    ReqID : req.id
                }
            }
        );
    }
};

// Melhorias no Sistema de Login com os Token de Sessão e de Acesso 01/05/2026, Passei a criação dos códigos para uma classe em um arquivo separado e adicionei a criação e o envio do acess token ao realizar o login agr contamos com dois tokens de autenticação, o de sessão e o de acesso.
export async function login(req, res) { // Validada as implementações do novo sistema de acess e refresh token, falta adicionar um controle para que o usuário não faça diversas solicitações de login 22/06/2026
    try {
        const Login = await Logins.buscandoLogin(req.Email);
        
        if (!Login.length) { // Se a variavel login for uma array vazia significa que não existe um usuario cadastrado com aquele email e logo entra no if e retorna a resposta a requisição com o status 401 não autorizado
            
            req.log.error(
                {
                    Acao : "LOGIN",
                    Status : "ERRO",
                    Erro : {
                        Titulo : "Email não cadastrado",
                        Detalhes : `Email não cadastrado: ${req.Email}`,
                        ReqID : req.id
                    }
                }
            )
            
            return res.status(404).json(
                {
                    Erro : {
                        Titulo : "Usuario não encontrado",
                        Detalhes : "O Email informado não está cadastrado",
                        ReqID : req.id
                    }
                }
            );
        }

        if (!Login[0].Ativo) { // Validando se o usuário está com a conta ativa

            req.log.error(
                {
                    Acao : "LOGIN",
                    Status : "ERRO",
                    Erro : {
                        Titulo : "Usuario não está Ativo",
                        Detalhes : `O Usuario ${Login[0].Id_Usuario}, não está ativo`,
                        Id_Usuario : Login[0].Id_Usuario,
                        ReqID : req.id
                    }
                }
            );

            return res.status(403).json(
                {
                    Erro : {
                        Titulo : "Não autorizado, Usuario desativado!",
                        Detalhes : "O Usuario não está ativo",
                        ReqID : req.id
                    }, 
                    IdUsuario :  Login[0].Id_Usuario
                }
            );
        }
        
        if(!await Hashing.verificaHash(Login[0].Senha, req.Senha)) { // Verifica Senha
            req.log.error(
                {
                    Acao : "LOGIN",
                    Status : "ERRO",
                    Erro : {
                        Titulo : "Senha Incorreta",
                        Detalhes : "A senha informada está incorreta",
                        ReqID : req.id
                    }
                }
            );

            return res.status(401).json(
                {
                    Erro : {
                        Titulo : "Senha incorreta",
                        Detalhes : "A Senha informada está incorreta",
                        ReqID : req.id
                    }
                }
            );
        }

        // Caso a senha e todos os dados de login forem corretos podemos prosseguir para a criação dos tokens de sessão e o acess token

        // Primeiro apagamos os dados da tabela de sessão, é uma tabela que estou utilizando para guardar o token de sessao para poder compara-lo e ter mais uma referencia da sessão ao usuário
        await Sessoes.excluiSessao(Login[0].Id_Usuario); // Apagando a sessão caso o usuário possua, se não encontrar nenhum registro o sequelize não faz nada e nem gera um erro ele apenas retorna um numero inteiro que significa a quantidade de linhas afetadas pela ação.
        
        // Após apagar os dados da sessão criamos uma nova sessão.
        const CriandoSessao = await Sessoes.criaSessao(Login[0].Id_Usuario);

        // Verificamos se a Sessão foi criada com sucesso
        if (!CriandoSessao.SessaoCriada) {
            throw new Error(CriandoSessao.Sessao); // Caso a Sessão não tenha sido criada, disparamos um novo erro.
        }

        // Criando o Cookie que armazena o token de sessão.
        res.cookie( // Reconfigurar para ter segurança nos cookies, permitir que não seja lido por js e só seja enviado por https
            'sessionToken', // Definindo o nome do Cookie
            CriandoSessao.Sessao.Token, // Conteudo do Cookie, atribuindo o token de sessão para o cookie
            {
                path : '/', // Torna o Cookie acessivel em toda a aplicação 
                secure : false, //Isso faz com que o cookie so seja enviado atraves de uma requisição https, se true, se false o cookie pode ser enviado via http
                httpOnly : false, //Dps nos muda para true pois isso evita que o cookie seja acessivel via JS
                sameSite : 'lax',
            }
        );

        req.log.info(
            {
                Acao : "LOGIN",
                Status : "OK",
                Detalhes : `Usuario logado com sucesso ${Login[0].Id_Usuario}`,
                Id_Usuario : Login[0].Id_Usuario,
                Device : req.headers['user-agent'],
                Data : new Date(),
                ReqID : req.id
            }
        );

        // Respondendo a Solicitação de Login com o token de sessão em um cookie e o acess token no body da aplicação.
        return res.status(200).json(
            {
                IdUsuario : Login[0].Id_Usuario, 
                AcessToken : await Sessoes.criaAcessToken(Login[0].Id_Login)
            }
        );

    } catch (error) {
        req.log.error(
            {
                Acao : "LOGIN",
                Status : "ERRO",
                Erro: {
                    Titulo : "Erro interno do Servidor",
                    Detalhes : error,
                    ReqID : req.id
                }
            }
        );

        return res.status(500).json(
            {
                Erro : {
                    TItulo : "Erro interno do servidor",
                    Detalhes : "Um erro inesperado aconteceu ao tentar ralizar o login"
                }
            }
        );
    }
}
// 12/07/2026 - Adicionei os Logs e refatorei as respostas, retirei toda a lógica do bd para os service de Usuarios e Logins