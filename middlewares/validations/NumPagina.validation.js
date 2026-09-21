import { validationResult, body } from "express-validator";

const ValidacaoNumPagina = [ // Validar

    body('Pagina').trim().escape().notEmpty(),

    (req, res, next) => {
        try {
            const Errors = validationResult(req);

            if (!Errors.isEmpty()) 
            {
                return res.status(400).json({Erro: Errors[0]});// Validar oque realmente validationResult retorna    
            }

            req.PaginaRequerida = req.body.Pagina;

            next();

        } catch (error) {
            return res.status(500).json({Erro : error});
        }
    }
];

export default ValidacaoNumPagina;
