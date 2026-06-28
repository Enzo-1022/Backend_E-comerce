import jwt from "jsonwebtoken";

import 'dotenv/config';
import Sessoes from "../Services/sessoes.js";

export default async function middlewareVerificaAcessToken (req, res, next) { // Middleawre que verifica o acess token
    try {
        var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;

        if (token == undefined) 
        {
            return res.status(401).json({Erro : `Token Indefinido`});
        }

        const VerificandoToken = Sessoes.validaAcessToken(token);

        req.userID = VerificandoToken.Id_Usuario;
        req.IsAdmin = VerificandoToken.IsAdmin; // Add pois irei precisar no middleware de roles.

        return next();

    } catch (error) {

        if (error.name == "TokenExpiredError") 
        {
            return res.status(401).json({Erro: 'Token Expirado'});
        }

        console.error(error);
        return res.status(500).json({Erro: "Erro Interno do Servidor"});
    }
}
