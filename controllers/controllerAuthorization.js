import jwt from "jsonwebtoken";
import 'dotenv/config';
import Sessoes from "../Services/sessoes.js";

const SessionPasword = process.env.PasswordSession;

export async function AttAcessToken(req, res) { // Callback para atualizar o acess token antes da requisição chegar a esse callback ela passa por um middleware que verifica o token de sessão o refresh token
   try {
        // Função para atualizar o acess token 
        const CriandoAcessToken = await Sessoes.criaAcessToken(req.userID);

        return res.status(200).json({'AcessToken': CriandoAcessToken});

   } catch (error) {
        res.status(500).json({Erro : "error"});
   }
}
