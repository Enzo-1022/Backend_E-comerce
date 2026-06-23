import jwt from 'jsonwebtoken';

import 'dotenv/config';

import mSessoes from '../models/mSessoes.js'; // Modelo de sessôes

import Sessoes from '../Services/sessoes.js'; // Classe de Services das Sessões

export default async function middlewareSessao(req, res, next) { // Validado para o novo padrão adotado de Autenticação 
  try { 
    const Token = req.cookies.sessionToken? req.cookies.sessionToken : undefined;

    if (Token == undefined) 
    {
      return res.status(401).json({Erro : "Token Indefinido"});
    }

    const VerificandoSessao = await Sessoes.verificaSessao(Token);

    if (!VerificandoSessao?.SessaoValida) 
    {
      return res.status(401).json({Erro : "Sessão Expirada"});
    }

    // adicionando user id a requisição para caso algum middleware subsequente precise
    req.userID = VerificandoSessao.UserID;

    return next();

  } catch (error) {
    if (error.name == 'TokenExpiredError' || error.name == 'JsonWebTokenError')
    {
      return res.status(401).json({ Erro: "Sessão Expirada" });
    }
    console.error(error)
    return res.status(500).json({ Erro: "Erro ao Verificar Sessão" });

  }
}
