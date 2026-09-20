import { body, validationResult } from "express-validator";

const ValidacaoLogin = [
    body('Email').trim().escape().notEmpty(),
    body('Senha').trim().escape().notEmpty(),

    (req, res, next) => {
        try {
            const Errors = validationResult(req);

            if (!Errors.isEmpty()) {
                return res.status(400).json({Erro : Errors[0]});
            }

            req.Email = req.body.Email;
            req.Senha = req.body.Senha;

            next();

        } catch (error) {
            return res.status(500).json({ Erro : error });
        }
    }
];

export default ValidacaoLogin;
