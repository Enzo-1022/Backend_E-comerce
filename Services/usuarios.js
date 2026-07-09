export default class Usuarios {
    userModel
    hashing

    constructor(pUserModel, pHashing) {
        this.userModel = pUserModel;
        this.hashing = pHashing;
    }

    /**
     * Realiza o cadastro do usuario
     * 
     * @param {*} pNome - Nome do Usuario 
     * @param {*} pDtNascimento - Data De Nascimento do Usuario
     * @param {*} pCpf - CPF do Usuario
     * @param {*} pEmail - Email do Usuario
     * @param {*} pSenha - Senha do usuario
     * @returns {*} - Objeto com os objetos criados referentes ao cadastro do usuario e do login
    */
    async cadastroUsuario(pNome, pDtNascimento, pCpf, pEmail, pSenha) {
        try {
            const novoUsuario = await Usuarios.create(
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
                    Senha : await hashing.criandoHash(req.Senha),
                    Admin : false,
                    ativo: true
                }
            );

            return {novoUsuario, novoLogin};
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @param {*} pCpf 
    */
    async verificaCpf(pCpf) {
        const VerificaCpf = await Usuarios.count(
            {
                where : {
                    Cpf : pCpf
                }
            }
        );
    }

    /**
     * @param {*} pEmail 
    */
    async verificaEmail(pEmail) {
        const verificaEmail = await Logins.count(
            {
                where : { 
                    Email : pEmail
                }
            }
        );
    }

}