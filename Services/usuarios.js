export default class Usuarios {
    #userModel
    #serviceLogin

    constructor(pUserModel, pHashing, pServiceLogin) {
        this.#userModel = pUserModel;
        this.#serviceLogin = pUserModel;
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
            const novoUsuario = await this.userModel.create(
                {
                    Nome : pNome,
                    Data_Nascimento : pDtNascimento,
                    Cpf : pCpf
                }
            );

            const novoLogin = await this.serviceLogin.cadastroLogin(novoUsuario.Id_Usuario, pEmail, pSenha);

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
            const VerificaCpf = await this.#userModel.count(
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
}
