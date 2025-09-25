import jwt from 'jsonwebtoken';

import 'dotenv/config';

import Sessoes from '../models/mSessoes.js'; // Modelo de sessôes

export async function middlewareSessao(req, res, next) {
  try {
    if(req.cookies == null || req.cookies.sessionToken == null)
    {
      return res.status(401).json({ Erro: "Não Autorizado! Sessão Invalida." });
    }
    else
    {
      const token = jwt.verify(req.cookies.sessionToken, process.env.PasswordSession);

      const Sessao =  await Sessoes.findAll({
        where : {
          Id_Usuario : token.Id_Usuario
        }
      });

      if (!Sessao.length) {
        return res.status(401).json({ Erro: "Não Autorizado! Sessão Invalida." });
      }

      next();
    }
  } catch (error) {

    if (error.name === 'TokenExpiredError' && error.name === 'JsonWebTokenError') 
    {
      return res.status(401).json({ Erro: "Não Autorizado! Sessão Expirada." });
    }
    else
    {
      return res.status(500).json({ Erro: "Erro Interno do Servidor!"+error })
    }
  }
}

export default middlewareSessao;
// 23/09/2025 - Middleware para verificar se o token de sessão é valido ou não.
// validar se esta tudo certo, se quando um usuario não possui o cooki ele tarata normalmente e etc... colocar o httponly no cookie de sessão.