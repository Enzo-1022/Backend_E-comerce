import jwt from 'jsonwebtoken';

import 'dotenv/config';

import Sessoes from '../models/mSessoes.js'; // Modelo de sessôes

export default async function middlewareSessao(req, res, next) {
  try {

    var token = !req.headers.authorization? undefined : req.headers.authorization.split(' ')[1]; // Adicionei a validação para caso não exista nada no cabeçalho aurhorization, fazer mais validações 25/02/2026.

    if (token == null || token == undefined) 
    {
      return res.status(401).json({Erro : `Não Autorizado! Token Indefinido`});
    }

    const VerificacaoToken = jwt.verify(token, process.env.PasswordSession)

    const Sessao = await Sessoes.findAll({
      where : {
        Id_Usuario : VerificacaoToken.Id_Usuario
      } 
    });

    // Validar se no método jwt.verify ja tem a verificação de expiração por time/hora

    if (!Sessao.length) 
    {
      return res.status(401).json({Erro : "Não autorizado! Token Invalido!"});
    }

    // add o user id a requisição para caso algum middleware subsequente precise
    req.userID = VerificacaoToken.Id_Usuario;

    next();

  } catch (error) {

    if (error.name == 'TokenExpiredError' && error.name == 'JsonWebTokenError') 
    {
      return res.status(401).json({ Erro: "Não Autorizado! Sessão Expirada." });
    }

    return res.status(500).json({ Erro: `${error}` });

  }
}

// export default middlewareSessao;
// 23/09/2025 - Middleware para verificar se o token de sessão é valido ou não.
// validar se esta tudo certo, se quando um usuario não possui o cooki ele tarata normalmente e etc... colocar o httponly no cookie de sessão.
// 26/09/2025 refatorado para ao invés de usarmos os cookies para obter o 