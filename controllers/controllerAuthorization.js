import jwt from "jsonwebtoken";
import 'dotenv/config';
import Sessoes from "../Services/sessoes";

const SessionPasword = process.env.PasswordSession;

function AttAcessToken(req, res) {
   try {
        // Função para atualizar o acess token 
        const CriandoAcessToken = Sessoes.criaAcessToken(req.userID, false);
        res.status(200).json({'AcessToken': CriandoAcessToken});
   } catch (error) {
        res.status(500).json({Erro : error});
   }
}
