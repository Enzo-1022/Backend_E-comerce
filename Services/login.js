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
            const cadastrandoLogin = await this.#loginModel.create(
                {
                    Id_Usuario : pIdUsuario,
                    Email : pEmail,
                    Senha : await this.#serviceHashing.criandoHash(pSenha),
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
            const buscandoEmail = this.#loginModel.count(
                {
                    where : {
                        Email : pEmail
                    }
                }
            )
    
            return buscandoEmail;
            
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Método que Busca um Registro de Login com base no Email do Usuário
     * 
     * @param {*} pEmail - Email que será usado como parametro de Busca
     * @returns - Retorna uma instancia do modelo de Login com os dados encontrados na pesquisa/busca, caso de algum erro retorna o erro para que ele seja tratado na proxima cadeia de tratamento de erros
     */
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

    /**
     * Método que desativa o login de um usuário com base no Id dele, Basicamente essa função é usada para desativar o perfil de usuarios.
     * 
     * @param {*} idUser - Id do usuario que será usado como parametro de busca
     * @returns - Retorna uma array com 2 indices o primeiro é o total de linhas afetadas pelo update, o segundo indice é são as linhas afetadas, utilizamos o primeiro indice para validar se o usuário foi realmente desativado. Em caso de erros retornamos um novo erro para a proxima cadeia de tratamento de erros.      
     */
    async desativandoLogin(idUser) {
        try {
            const desativandoUsuario = await this.#loginModel.update(
                {
                    Ativo : false
                },
                {
                    where : {
                        Id_Usuario : idUser
                    }
                }
            );

            return desativandoUsuario;

        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Método que ativa o login do usuario, mudando o status de ativo na tabela de login de false para true. Basicamente estamos usando esse método para ativar os usuários que foram desativados antes.
     * 
     * @param {*} idUser - Id do usuário que será usado como parametro de busca
     * @returns -Retorna uma array com 2 indices o primeiro é o total de linhas afetadas pelo update, o segundo indice retrata as linhas afetadas, utilizamos o primeiro indice para validar se o usuário foi realmente desativado. Em caso de erros retornamos um novo erro para a proxima cadeia de tratamento de erros.
     */
    async ativandoLogin(idUser) {
        try {
            const ativandoLogin = await this.#loginModel.update(
                {
                    Ativo : true
                },
                {
                    where : {
                        Id_Usuario : idUser
                    }
                }
            );

            return ativandoLogin;

        } catch (error) {
            throw new Error(error);
        }
    }

}
