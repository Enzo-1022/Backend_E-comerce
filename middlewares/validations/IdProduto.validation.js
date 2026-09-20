import { param, validationResult } from "express-validator";

const ValidacaoIdProduto = [
    param('Id_Produto').isInt().withMessage("O Id deve ser do tipo Int").toInt(),

    (req, res, next) => {
        try {
            const Errors = validationResult(req);

            if (!Errors.isEmpty()) {
                return res.status(400).json({Erro: 'Parametro de Rota Invalido'});
            }

            req.Id_Produto = req.params.Id_Produto.split(':')[1];
            
            next();

        } catch (error) {
            return res.status(500).json({Erro : error});
        }
    }
];

export default ValidacaoIdProduto;
