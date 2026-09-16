import mUsuarios from '../models/mUsuarios.js';
import mSessoes from '../models/mSessoes.js';
import mLogins from '../models/mLogins.js';

import sUsuarios from "../Services/usuarios.js";
import sLogin from "../Services/login.js";
import Sessoes from '../Services/sessoes.js';

const Login = new sLogin(mLogins, undefined);
const Usuarios = new sUsuarios(mUsuarios, undefined);

import 'dotenv/config';

/**
 * Callback que retorna o perfil dos usuarios
 * 
 * @param {} req - Objeto da Requisição do Próprio Express
 * @param {*} res - Objeto de Resposta do Próprio Express
 * @returns - 200 Ok com um Json com os dados de perfil do Usuario, 404 undefined Usuario não encontrado no banco pois não existe com um json informando o erro, 500 internal server error, quando não foi possivel achar o perfil do usuario por um erro na aplicação com um json informando o erro
 */
export async function perfilUsuario (req, res) {
    try {
        const perfilUsuario = await Usuarios.perfilUsuario(req.userID);

        if(!perfilUsuario) {
            req.log.error(
                {
                    Acao : "Perfil_Usuario",
                    Statis : "ERRO",
                    Erro : {
                        Titulo : `Usuario ${req.userID} não encontrado.`,
                        Detalhes : "Não foi possivel encontrar o usuario",
                        ReqID : req.id
                    }
                }
            );

            return res.status(400).json(
                {
                    Erro : {
                        Titulo : `Erro ao encontrar o usuário ${req.userID}`,
                        Detalhes : `Não encontramos o usuario com o ID: ${req.userID}`,
                        ReqID : req.id
                    }
                }
            );
        }

        req.log.info(
            {
                Acao : "PERFIL_USUARIO",
                Status : "OK",
                Detalhes : `Perfil do Usuario ${req.userID} acessado com sucesso!`,
                IdUsuario : req.userID,
                ReqID : req.id
            }
        );

        return res.status(200).json(
            {
                PerfilUsuario: perfilUsuario
            }
        );
    
    } catch (error) {

        req.log.error(
            {
                Acao : "PERFIL_USUARIO",
                Status : "ERRO",
                Erro : {
                    Titulo : `Erro ao Buscar o perfil do Usuario ${req.userID}`,
                    Detalhes : error,
                    ReqID : req.id
                }
            }
        );

        return res.status(500).json(
            {
                Erro : {
                    Titulo : `Erro ao buscar perfil do Usuario: ${req.userID}!`,
                    Detalhes : "Não foi possivel encontrar o perfil do usuario por problemas internos na aplicação",
                    ReqID : req.id
                } 
            }
        );
    }
}

/**
 * Callback para atualizar informações do Usuario (Por enquanto estamos permitindo atualizar apenas Nome e Data de Nascimento)
 * 
 * @param {*} req - Objeto da Requisição padrão do Express
 * @param {*} res - Objeto de Resposta padrão Express
 * @returns - 204 caso o registro seja atualizado com sucesso, 500 internal server error caso não seja possivel alterar o cadastro
 */
export async function atualizaUsuario (req, res) {
    try {

        const atualizandoUsuario = await Usuarios.atualizaCadastro(req.userID, req.Nome,  req.Data_Nascimento);

        if (!atualizandoUsuario[0]) {
            req.log.error(
                {
                    Acao : "ATUALIZAR_USUARIO",
                    Status : "ERRO",
                    Erro : {
                        Titulo : `Erro ao Atualizar o Usuario ${req.userID}`,
                        Detalhes : atualizandoUsuario,
                        ReqID : req.id
                    }
                }
            );

            return res.json(500).json(
                {
                    Erro : {
                        Titulo : `Erro ao tentar atualizar as informações do usuario ${req.userID}`,
                        Detalhes : "Nenhuma linha foi modificada"
                    }
                }
            );
        }

        req.log.info(
            {
                Acao : "ATUALIZAR_USUARIO",
                Status : "OK",
                Detalhes : `Perfil do Usuario ${req.userID} atualizado com sucesso!`,
                ReqID : req.id,
                IdUsuario : req.userID
            }
        );

        return res.status(204).end() // 204 é um código de sucesso mas que não envia nenhum conteudo em seu corpo.

    } catch (error) {

        req.log.error(
            {
                Acao : "ATUALIZAR_USUARIO",
                Status : "ERRO",
                Erro : {
                    Titulo : `Erro ao Atualizar o Usuario ${req.userID}`,
                    Detalhes : error,
                    ReqID : req.id
                }
            }
        );

        return res.status(500).json(
            {
                Erro : {
                    Titulo : `Erro ao tentar Atualizar o Usuario ${req.userID}`,
                    Detalhes : `Erro interno da aplicação ao tentar realizar a atualização`
                }
            }
        );
    }
}

/**
 * Callback que desativa a conta dos usuários
 * 
 * @param {*} req - Objeto da Requisição padrão do Express
 * @param {*} res - Objeto de Resposta padrão Express
 * @returns - 204 em caso de sucesso, 500 internal server error em caso de erros com a descrição do erro sendo enviada no body da requisição em formato JSON
 */
export async function desativaUsuario (req, res) { // Pequena mudança na regra pois antes a tabela que continha a informação se o usuario estava ativo era a própria do usuario alterei isso para a tabela de login
    // Aqui a lógica é a seguinte como estou utlizando JWT tokens para validar a sessão do usuario, eu pensei na seguite lógica como existe um midlleware que valida as sessões com base nos registros do banco de dados quando eu desativar o usuario eu apago esse registro e logo ao tentar acessar qualquer url que dependa de estar logado a api retorna o status não autorizado. Como ele não está logado ele não consegue mais acessar essa rota logo não poderá desativar seu perfil ja estando desativado, ja a lógica para reativar o perfil seria implementada no login do usuário quando ele tentasse entrar novamente cairia navalidação para saber se o usuario esta logado ou não estiver irá exibir a opção de reativação que cairá em outra rota.
    try {
        const desativandoUsuario = await Login.desativandoLogin(req.userID); // Atualizando o Status do Usuário para false

        if (!desativandoUsuario[0]) { // Verificando se a atualização de status ocorreu com exito 
            req.log.error(
                {
                    Acao : "DESATIVAR_USUARIO",
                    Status : "ERRO",
                    Id_Usuario : req.userID,
                    Erro : {
                        Titulo : `Erro ao Tentar Desativar o Usuário ${req.userID}`,
                        Detalhes : `Nenhum registro foi alterado ao tentar modificar o status de ativo do usuario ${req.userID}, Resultado da operação: ${desativandoUsuario}`,
                        ReqID : req.id
                    }
                }
            );

            return res.status(500).json(
                {
                    Erro : {
                        Titulo : `Erro ao Tentar Desativar o Usuário ${req.userID}`,
                        Detalhes : `Não foi possivel achar o perfil de login do Usuario ${req.userID}`,
                        ReqID : req.id
                    }
                }
            );
        }

        const apagandoSessao = await Sessoes.excluiSessao(req.userID) // Apagando os dados de sessão do Usuário

        if (!apagandoSessao) { // Verificando se a sessão foi apagada com sucesso
            req.log.error(
                {
                    Acao : "DESATIVAR_USUARIO",
                    Status : "ERRO",
                    Id_Usuario : req.userID,
                    Erro : {
                        Titulo : `Erro ao Tentar Desativar o Usuário ${req.userID}`,
                        Detalhes : `Nenhum registro foi alterado ao tentar apagar o registro da sessão do usuário ${req.userID}, Resultado da operação: ${apagandoSessao}`,
                        ReqID : req.id
                    }
                }
            );

            return res.status(500).json(
                {
                    Erro : {
                        Titulo : `Erro ao Desativar o Usuário ${req.userID}`,
                        Detalhes : `Nenhuma sessão encontrada para o Usuário ${req.userID}`,
                        ReqID : req.id
                    }
                }
            );
        }

        req.log.info(
            {
                Acao : "DESATIVAR_USUARIO",
                Status : "OK",
                Detalhes : `Usuario ${req.userID}, desativado com sucesso`,
                ReqID : req.id,
                IdUsuario : req.userID
            }
        );

        return res.status(204).end(); // Retornando a Resposta com um status de OK mas sem o body da requisição

    } catch (error) {

        req.log.error(
            {
                Acao : "DESATIVAR_USUARIO",
                Status : "ERRO",
                Id_Usuario : req.userID,
                Erro : {
                    Titulo : `Erro ao Tentar Desativar o Usuário ${req.userID}`,
                    Detalhes : error,
                    ReqID : req.id
                }
            }
        );

        return res.status(500).json(
            {
                Erro : {
                    Titulo : `Erro ao Desativar o Usuario ${req.userID}`,
                    Detalhes : "Não foi possivel desativar a conta do usuário, por um erro interno na aplicação",
                    ReqID : req.id
                }
            }
        );
    }
}

export async function ativarUsuario(req, res) {
    try {
        const ativandoUsuario = await Login.ativandoLogin(req.userID);

        if (!ativandoUsuario[0]) {

            req.log.error(
                {
                    Acao : "ATIVAR_USUARIO",
                    Status : "ERRO",
                    Id_Usuario : req.userID,
                    Erro : {
                        Titulo : `Erro ao Tentar ativar o Usuário ${req.userID}`,
                        Detalhes : `Nenhum registro de login foi modificado. Resultado da Operação ${ativandoUsuario}`,
                        ReqID : req.id
                    }
                }
            );

            return res.status(500).json(
                {
                    Erro : {
                        Titulo : `Erro ao tentar ativar o usuário ${req.userID}`,
                        Detalhes : `Não foi possivel encontrar o perfil do usuario ${req.userID} para ativação.`,
                        ReqID : req.id
                    }
                }
            );
        }

        const criandoSessao = await Sessoes.criaSessao(req.userID);

        if (!criandoSessao.SessaoCriada) {

            // Bem nessa parte pode ocorrer um erro caso não seja possivel criar a sessão do usuário, caso a sessão do usuário não consiga ser gerada mas o status de Ativo dele ja tiver sido alterado na Tabela de logins, devemos redirecionar o usuário para a pagina de login para que de lá ele tente acessar novamente, pois em teoria a parte de ativação de login já foi feita, essa parte é de login, uma alternativa para sair disso é apenas enviar o status de ok e quando o front receber já automaticamente redirecionar para o login

            req.log.error(
                {
                    Acao : "ATIVAR_USUARIO",
                    Status : "ERRO",
                    Id_Usuario : req.userID,
                    Erro : {
                        Titulo : `Erro ao Tentar ativar o Usuário ${req.userID}`,
                        Detalhes : `Não foi possivel criar a sessão do usuário. Resultado da Operação: ${criandoSessao}`,
                        ReqID : req.id
                    }
                }
            );

            return res.status(500).json(
                {
                    Erro : {
                        Titulo : `Erro ao tentar ativar o Usuário`,
                        Detalhes : "Usuario ativado, mas tivemos um erro ao tentar criar sua sessão, volte para o login e tente novamente.",
                        ReqID : req.id
                    }
                }
            );
        }

        res.cookie(
            'sessionToken', 
            criandoSessao.Sessao.Token, 
            {
                path : '/',
                secure : false,
                httpOnly : false,
                sameSite : 'lax'
            }
        );

        req.log.info(
            {
                Acao : "ATIVAR_USUARIO",
                Status : "OK",
                Detalhes : `Perfil do Usuario ${req.userID} ATIVADO com sucesso!`,
                ReqID : req.id,
                IdUsuario : req.userID
            }
        );

        return res.status(204).end();

    } catch (error) {
        req.log.error(
            {
                Acao : "ATIVAR_USUARIO",
                Status : "ERRO",
                Id_Usuario : req.userID,
                Erro : {
                    Titulo : `Erro ao Tentar ativar o Usuário ${req.userID}`,
                    Detalhes : error,
                    ReqID : req.id
                }
            }
        );

        return res.status(500).json(
            {
                Erro : {
                    Titulo : `Erro ao tentar ativar o usuário ${req.userID}`,
                    Detalhes : "Erro interno na aplicação ao tentar ativar usuário"
                }
            }
        );
    }
}
