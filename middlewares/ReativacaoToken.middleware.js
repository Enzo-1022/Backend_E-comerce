import sSessoes from "../Services/Sessoes.service.js";
import jwt from "jsonwebtoken";

const Sessoes = new sSessoes(undefined, jwt, undefined);

export default async function ReativacaoToken(req, res, next) {
    try {
        const Token = req.cookies.tokenDeReativacao ? req.cookies.tokenDeReativacao : undefined;

        if (!Token) {
            res.status(401).json({Erro : "Token de Reativação Inspirado!"});
        }

        const Validando = await Sessoes.verificaTokenReativacao(Token);

        req.userID = Validando.Id_Usuario;

        return next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({Erro: "Erro Interno do Servidor!"})
    }
}