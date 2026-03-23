import { param, validationResult } from "express-validator";

const ValidacaoIdUsuario = [

    param("Id_Usuario").isInt().withMessage("O Id Deve Ser do Tipo Int").toInt(),

    (req, res, next)  => {
        try {
            const Errors = validationResult(req);

            if (!Errors.isEmpty()) 
            {
                return res.status(400).json({Erro : `Parametro de Rota Invalido ${Errors[0]}`});
            }

            req.userID = req.params.Id_Usuario;

            next();

        } catch (error) {
            return res.status(500).json({Erro : error});
        }
    }
];

export default ValidacaoIdUsuario;
