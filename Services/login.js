export default class Logins {
    #loginModel
    #serviceHashing

    constructor(pLoginModel, pServiceHashing){
        this.#loginModel = pLoginModel;
        this.#serviceHashing = pServiceHashing;
    }

    /**
     * Método de cadastro de login do Usuário
     * 
     * @param {*} pEmail - Email do Usuario
     * @param {*} pIdUsuario - Id do Usuario
     * @param {*} pSenha - Senha do Usuario 
     * @returns {*} - Obejeto do cadastro do Usuario
     */
    async cadastroLogin(pIdUsuario, pEmail, pSenha) {
        try {
            const cadastrandoLogin = await this.loginModel.create(
                {
                    Id_Usuario : pIdUsuario,
                    Email : pEmail,
                    Senha : await this.serviceHashing.criandoHash(pSenha),
                    Admin : false,
                    ativo: true
                }
            );
    
            return cadastrandoLogin;
            
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Método que verifica se existe um email cadastrado na base de dados, utilizando o método count do sequelize que realiza a contagem de registros com a informação passada como parametro de consulta na where
     * 
     * @param {*} pEmail - Email que será buscado
     * @returns {*} - O Resultado da consulta será um numero referente a contagem dos registros encontrados. se houver um erro durante o processo, retornamos o erro.
     */
    async verificaEmail(pEmail) {
        try {
            const buscandoEmail = this.loginModel.count(
                {
                    where : {
                        Email : pEmail
                    }
                }
            )
    
            return buscandoEmail;
            
        } catch (error) {
            throw new error;
        }
    }

    async buscandoLogin(pEmail){
        try {
            const buscandoLogin = await this.#loginModel.findAll(
                {
                    where : {
                        Email : pEmail
                    },
                    raw : true // Utilizando o método raw como true o sequelize nos traz apenas os dados buscados diretamente do banco sem os metadados que o sequelize traz com o findall com raw: false
                }
            );

            return buscandoLogin;
        } catch (error) {
            throw new Error(error);
        }
    }
}
