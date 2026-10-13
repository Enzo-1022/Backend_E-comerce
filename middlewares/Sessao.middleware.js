import 'dotenv/config';

import sSessoes from '../Services/Sessoes.service.js'; // Classe de Services das Sessões

import mSessoes from "../models/Sessoes.model.js";

import mLogins from "../models/Logins.model.js";

import jwt from "jsonwebtoken";

const Sessoes = new sSessoes(mSessoes, jwt, mLogins);

export default async function middlewareSessao(req, res, next) { // Validado para o novo padrão adotado de Autenticação 
  try {
    const Token = await req.cookies.sessionToken ? req.cookies.sessionToken : undefined;

    if (Token == undefined) 
    {
      return res.status(401).json({Erro : "Token Indefinido de sessão indefinido"});
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
