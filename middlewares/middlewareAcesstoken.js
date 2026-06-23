import jwt from "jsonwebtoken";

import 'dotenv/config';
import Sessoes from "../Services/sessoes.js";

export default async function middlewareVerificaAcessToken (req, res, next) { // Middleawre que verifica o acess token
    try { // Testar isso aqui dps
        var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;

        if (token == undefined) 
        {
            return res.status(401).json({Erro : `Token Indefinido`});
        }

        const VerificandoToken = Sessoes.validaAcessToken(token);

        req.userID = VerificandoToken.Id_Usuario;

        return next();

    } catch (error) {

        if (error.name == "TokenExpiredError") 
        {
            return res.status(401).json({Erro: 'Token Expirado'});
        }

        return res.status(500).json({Erro: error});
    }
}
