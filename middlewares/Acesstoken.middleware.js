import 'dotenv/config';
import sSessoes from "../Services/Sessoes.service.js";
import mLogins from "../models/Logins.model.js";
import jwt from "jsonwebtoken";

const Sessoes = new sSessoes(undefined, jwt, mLogins);

export default async function middlewareVerificaAcessToken (req, res, next) { // Middleawre que verifica o acess token
    try {
        var token = req.cookies.acessToken ? req.cookies.acessToken : undefined;

        if (token == undefined) 
        {
            return res.status(401).json({Erro : `Acess Token Indefinido`});
        }

        const VerificandoToken = await Sessoes.validaAcessToken(token);

        req.userID = VerificandoToken.Id_Usuario;
        req.IsAdmin = VerificandoToken.IsAdmin; // Add pois irei precisar no middleware de roles.

        return next();

    } catch (error) {

        if (error.name == "TokenExpiredError") 
        {
            return res.status(401).json({Erro: 'Token Expirado'});
        }
        if (error.name == "Usuario Desativado!") return res.status(403).json({Erro : "Usuario Desativado"})

        return res.status(500).json({Erro: "Erro Interno do Servidor"});
    }
}
