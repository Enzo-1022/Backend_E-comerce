import { body, validationResult } from "express-validator";

const ValidacaoCadastroUsuario = [
    body('Email').trim().escape().notEmpty(),
    body('Senha').trim().escape().notEmpty(),
    body('Cpf').trim().escape().notEmpty(),
    body('Data_Nascimento').trim().escape().notEmpty(),
    body('Nome').trim().escape().notEmpty(),

    (req, res, next) => {
        try {
            const Errors = validationResult(req);

            if (!Errors.isEmpty()) {
                return res.status(400).json({Erro : Errors[0]});
            }

            req.Email = req.body.Email;
            req.Senha = req.body.Senha;
            req.Cpf = req.body.Cpf;
            req.Data_Nascimento = req.body.Data_Nascimento;
            req.Nome = req.body.Nome;

            next();

        } catch (error) {
            return res.status(500).json({Erro: error});
        }
    }
];

export default ValidacaoCadastroUsuario;
