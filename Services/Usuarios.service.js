export default class Usuarios {
    #userModel
    #serviceLogin

    constructor(pUserModel, pServiceLogin) {
        this.#userModel = pUserModel;
        this.#serviceLogin = pServiceLogin;
    }

    /**
     * Método que Realiza o Cadastro dos Usuários.
     * 
     * @param {*} pNome - Nome do Usuario 
     * @param {*} pDtNascimento - Data De Nascimento do Usuario
     * @param {*} pCpf - CPF do Usuario
     * @param {*} pEmail - Email do Usuario
     * @param {*} pSenha - Senha do usuario
     * @returns {*} - Retorna 2 objetos, o novoUsuario traz as informações do cadastro do usuário, ja o novoLogin raz as informações cadastradas para o login
    */
    async cadastroUsuario(pNome, pDtNascimento, pCpf, pEmail, pSenha) {
        try {
            const novoUsuario = await this.#userModel.create(
                {
                    Nome : pNome,
                    Data_Nascimento : pDtNascimento,
                    Cpf : pCpf
                }
            );

            const novoLogin = await this.#serviceLogin.cadastroLogin(novoUsuario.Id_Usuario, pEmail, pSenha);

            return {novoUsuario, novoLogin};
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Método que verifica se existe um cpf já cadastrado
     * 
     * @param {*} pCpf - Cpf que será buscado
     * @returns {*} - Retorna a contagem da consulta com o cpf informado. Se houver algum erro durante o processo retornamos o erro
    */
    async verificaCpf(pCpf) {
        try {
            const VerificaCpf = await this.#userModel.count( // Count retorna o numero de registros encontrados, por isso estou retornando ele, pois se for 0 aquele user não existe se for outro numero ele existe, na regra de negocio não se pode criar mais de um user com um mesmo cpf
                {
                    where : {
                        Cpf : pCpf
                    }
                }
            );
    
            return VerificaCpf;
            
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Função que retorna as informações de perfil do usuário
     * 
     * @param {*} idUser - Id do Usuario que servirá como parametro de Busca
     * @returns - Em caso de sucesso na busca a função retorna um json com os dados do usuario, em caso de não achar nenhum registro retorna null, caso aconteça algum erro retornará o erro
     */
    async perfilUsuario(idUser) {
        try {
            const userPerfil = await this.#userModel.findByPk( // O método FindByPk retorna a instancia do modelo com os dados achado, ou retorna null caso não encontre o registro
                idUser,
                {
                    raw : true
                }
            );

            return userPerfil;

        } catch (error) {
            throw new Error(error);
        }
    }

    async atualizaCadastro(idUser, nomeUser, dtNascUser) {
        try {
            const attUsuario = await this.#userModel.update( // O método update do sequelize nos retorna um array, onde o primeiro indice é a contagem total de linhas afetadas pelo update e o segundo indice são as linhas afetadas (Linhas = Registros)
                {
                    Nome : nomeUser,
                    Data_Nascimento : dtNascUser
                },
                {
                    where : {
                        Id_Usuario : idUser
                    }
                }
            );

            return attUsuario;
        } catch (error) {
            throw new Error(error);
        }
    }
    
}
