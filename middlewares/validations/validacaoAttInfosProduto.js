import { body, validationResult } from "express-validator";

const ValidacaoAttInfosProduto = [
    body('Nome').trim().escape().notEmpty(),
    body('Quantidade').trim().escape().notEmpty(),
    body('Descricao').trim().escape().notEmpty(),
    body('Preco').trim().escape().notEmpty(),

    (req, res, next) => {
        try {
            const Errors = validationResult(req);

            if (!Errors.isEmpty()) {
                return res.status(400).json({Erro: "Dados Invalidos"});
            }

            return next();
        } catch (error) {
            console.error(error);

            return res.status(500).json({Erro: "Erro interno do Servidor"});
        }
    }
]; 

export default ValidacaoAttInfosProduto;
