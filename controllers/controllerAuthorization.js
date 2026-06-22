import jwt from "jsonwebtoken";
import 'dotenv/config';
import Sessoes from "../Services/sessoes.js";

const SessionPasword = process.env.PasswordSession;

export async function AttAcessToken(req, res) {
   try {
        // Função para atualizar o acess token 
        const CriandoAcessToken = await Sessoes.criaAcessToken(req.userID, false);

        return res.status(200).json({'AcessToken': CriandoAcessToken});

   } catch (error) {
        res.status(500).json({Erro : error});
   }
}
