import 'dotenv/config';

const PasswordSession =  process.env.PasswordSession;
const PasswordAcessToken = process.env.PasswordAcessToken;
const PasswordTokenReativacao = process.env.PasswordTokenReativacao;

export default class Sessoes {
    #mSessoes;
    #mLogin;
    #jwt;

    constructor(pMSessoes, pJwt, pMLogin){
        this.#mSessoes = pMSessoes,
        this.#mLogin = pMLogin,
        this.#jwt = pJwt
    }

    async criaSessao(userId) {
        return await this.#mSessoes.create(// Criando um novo registro de sessão no banco de dados
            {
                Id_Usuario : userId,
                Token : this.#jwt.sign({ Id_Usuario : userId }, PasswordSession, { expiresIn : '7d', algorithm: 'HS256' }) // Criando o token de sessão com JWT
            }
        ).then( 
            sessao => {
                return {
                    SessaoCriada : true, 
                    Sessao : sessao.toJSON()
                }
            }
        ).catch(
            err => {
                return {
                    SessaoCriada : false, 
                    Sessao : err
                } // Validar o erro
            }
        );
    }

    async verificaSessao(token) {
        const ValidandoSessiontoken = this.#jwt.verify(token, PasswordSession);

        const BuscandoSessao = await this.#mSessoes.findAll(
            { // Buscando se já existe uma sessão ativa para o usuario que está tentando logar
                where : {
                    Id_Usuario : ValidandoSessiontoken.Id_Usuario
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

        return {SessaoValida : true, UserID : ValidandoSessiontoken.Id_Usuario};
    }

    async excluiSessao(userId) {
        const ExcluindoSessao = await this.#mSessoes.destroy(
            {
                where : {
                    Id_Usuario : userId
                }
            }
        ); 

        console.log("Sessao Excluida Abaixo: ")
        console.log(ExcluindoSessao); // Adicionar Uma Biblioteca de Logs para termos um registro para auditoria dessas exclusões, operações sensiveis no BD merecem um tratamento de logs para auditoria.

        return ExcluindoSessao; // utilizando o método destroy o sequelize retorna a quantidade de registros excluidos, aqui estamos retornando para caso eu precise de alguma validação ao decorrer da aplicação
    }

    // Acess Token
    async criaAcessToken(UserID) {

        const Login = await this.#mLogin.findAll(
            {
                where : {
                    Id_Usuario : UserID
                },
                raw : true
            }
        );

        return this.#jwt.sign(
            {
                Id_Usuario : Login[0]?.Id_Usuario,
                IsAdmin: Login[0]?.Admin == null ? false : Login[0]?.Admin
            },
            PasswordAcessToken,
            {
                expiresIn : '15m'
            }
        );
    }

    async validaAcessToken(token) {

        const validando = await this.#jwt.verify(token, PasswordAcessToken);

        const login = await this.#mLogin.findAll(
            { 
                where : {
                    Id_Usuario : validando.Id_Usuario
                },
                raw : true 
            }
        );

        if (!login[0].Ativo) {
            throw new Error("Usuario Desativado!", {cause : "Usuario desativado"});
        }

        return validando;
    }

    async criaTokenDeReativacao(userID) {
        return await this.#jwt.sign(
            {
                Id_Usuario : userID
            },
            PasswordTokenReativacao,
            {
                expiresIn : "15m"
            }
        );
    }

    async verificaTokenReativacao(token) {
        return await this.#jwt.verify(token, PasswordTokenReativacao);
    }
}
