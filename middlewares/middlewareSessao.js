import jwt from 'jsonwebtoken';

import 'dotenv/config';

import mSessoes from '../models/mSessoes.js'; // Modelo de sessôes

import Sessoes from '../Services/sessoes.js';

// Irei modificar a lógica para mandar o refresh/session token através dos cookies
export default async function middlewareSessao(req, res, next) {
  try {

    console.log(req.cookies); //Retirar depois, estou usando apenas para Depurar 
  
    var token = req.cookies.sessionToken? req.cookies.sessionToken : undefined; // Testar para saber se está dando certo essa verificação 

    if (token == undefined) 
    {
      return res.status(401).json({Erro : `Não Autorizado! Token Indefinido`});
    }

    const VerificandoSessao = await Sessoes.verificaSessao(token.Id_Usuario, token);

    if (!VerificandoSessao) 
    {
      return res.status(401).json({Erro : "Não autorizado! Token Invalido!"});
    }

    // adiciona o user id a requisição para caso algum middleware subsequente precise
    req.userID = VerificacaoToken.Id_Usuario;

    return next();

  } catch (error) {
    if (error.name == 'TokenExpiredError' || error.name == 'JsonWebTokenError') // Antes estava com o sinal de and && e não estava capatando o erro para informar que o token era invalido
    {
      return res.status(401).json({ Erro: "Não Autorizado! Sessão Expirada." });
    }

    return res.status(500).json({ Erro: `${error}` });

  }
}

// 23/09/2025 - Middleware para verificar se o token de sessão é valido ou não.
// validar se esta tudo certo, se quando um usuario não possui o cooki ele tarata normalmente e etc... colocar o httponly no cookie de sessão.
// 26/09/2025 refatorado para ao invés de usarmos os cookies para obter o