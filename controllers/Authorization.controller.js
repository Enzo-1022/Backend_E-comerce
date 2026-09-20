import 'dotenv/config';
import Sessoes from "../Services/Sessoes.service.js";

const SessionPasword = process.env.PasswordSession;

export default async function AttAcessToken(req, res) { // Callback para atualizar o acess token, antes da requisição chegar a esse callback ela passa por um middleware que verifica o token de sessão (refresh token)
   try {
          // Função para atualizar o acess token 
          const CriandoAcessToken = await Sessoes.criaAcessToken(req.userID);

          req.log.info(
               {
                    Acao : "ATT_ACESS_TOKEN", 
                    Status : "OK", 
                    Detalhes : `Acess Token Atualizado com Sucesso para o Usuario ${req.userID}`, 
                    IdUsuario : req.userID, 
                    ReqID : req.id
               }
          );

          return res.status(200).json(
               {
                    'AcessToken': CriandoAcessToken
               }
          );

   } catch (error) {
          req.log.error(
               {
                    Acao : "ATT_ACESS_TOKEN", 
                    Status : "ERRO", 
                    Erro : {
                         Titulo : "Erro ao Atualizar Acess Token", 
                         Detalhes : error, 
                         ReqID : req.id
                    }
               }
          );
          
          return res.status(500).json(
               {
                    Erro : {
                         Titulo : "Erro ao Atualizar Acess Token",
                         Detalhes : "Erro interno do Servidor ao Atualizar o Acess Token",
                         ReqID : req.id
                    }
               }
          );
   }
}
