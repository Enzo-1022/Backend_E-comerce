import rateLimiterRedis from "../config/Redis.config.js";

export default function middlewareRateLimite(req, res, next) { // Começo da estruturação do middleware que impede varias solicitações de um só ip as rotas.

    const UserIP = req.ip;

    rateLimiterRedis.consume(UserIP, 2).then(
        (rateLimiter) => {
            // res.setHeader('X-RateLimit-Limit', rateLimiter.points); // Aqui estamos setando um novo cabeçalho informando o limite de requisições que o usuário possui
            // res.setHeader('X-RateLimit-Remaining', rateLimiter.remainigPoints); // Setando um cabeçalho informando a quantidade restante de solicitações que o usuário ainda tem
            // res.setHeader('X-RateLimit-Reset', new Data(Data.now() + rateLimiter.msBeforeNext)); // Setando um cabeçalho informando o tempo que o limite de requisições será resetado
            
            return next();
        }
    ).catch(
        (err) => {
            console.error(err);
            
            // res.setHeader('Retry-After', Math.round(err.msBeforeNext / 1000)); // Setando um cabeçalho informando o tempo para tentar novamente, basicamente informando em quanto tempo irá resetar o limite de requisição
            // res.setHeader('X-RateLimit-Limit', err.points); // setando o cabeçalho para informar o limite de requisições
            // res.setHeader('X-RateLimit-Ramaing', 0); // Setando um cabeçalho para informa a quantidade de requisições que o usuário ainda possui

            return res.status(429).json({Erro: "Muitas solicitações Realizadas"});
        }
    )
}
