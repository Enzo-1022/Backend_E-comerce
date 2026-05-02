import mSessoes from "../models/mSessoes";
import mLogin from "../models/mLogins";
import jwt from "jsonwebtoken";

import 'dotenv/config';

const PasswordSession =  process.env.PasswordSession;

export default class Sessoes {
    // Token de Sessão
    static async criaSessao(userId) {
        return await mSessoes.create(// Criando um novo registro de sessão no banco de dados
            {
                Id_Usuario : userId,
                Token : jwt.sign({ Id_Usuario : userId }, PasswordSession, { expiresIn : '7d' }) // Criando o token de sessão com JWT
            }
        ).then( 
            sessao => {
                return {SessaoCriada : true, Sessao : sessao.toJSON()}
            }
        ).catch(
            err => {
                return {SessaoCriada : false, Sessao : err} // Validar o erro
            }
        );
    }

    static async verificaSessao(userId, token) {
        try {
            const ValidandoSessiontoken = jwt.verify(token, PasswordSession);

            const BuscandoSessao = await mSessoes.findAll(
                { // Buscando se já existe uma sessão ativa para o usuario que está tentando logar
                    where : {
                        Id_Usuario : userId
                    },
                    raw : true
                }
            );

            if (!BuscandoSessao.length) {
                throw new Error("Nenhuma Sessão Encontrada");
            }

            if(BuscandoSessao[0].Token != token){
                throw new Error("Token Divergente");
            }

            return true;

        } catch (error) {
            console.error(error);
            return false;
        }  
    }

    static async excluiSessao(userId) {
        const ExcluindoSessao = await mSessoes.destroy(
            {
                where : {
                    Id_Usuario : userId
                }
            }
        ); 

        console.log(ExcluindoSessao); // Adicionar Uma Biblioteca de Logs para termos um registro para auditoria dessas exclusões, operações sensiveis no BD merecem um tratamento de logs para auditoria.

        return ExcluindoSessao; // utilizando o método destroy o sequelize retorna a quantidade de registros excluidos, aqui estamos retornando para caso eu precise de alguma validação ao decorrer da aplicação
    }

    // Acess Token
    static async criaAcessToken(userId, isAdmin) { // IsAdmin tem que ser um valor boolean

        const Longin = await mLogin.findByPk(userId);

        return jwt.sign({ Id_Usuario : userId, IsAdmin: Longin.toJSON().Admin }, PasswordSession, { expiresIn : '15m' });
    }

    static validaAcessToken(token) {
        return jwt.verify(token, PasswordSession);
    }
}
