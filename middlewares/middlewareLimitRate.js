import { createClient } from "redis";

import { RateLimiterRedis } from "rate-limiter-flexible";

const redisClient = await createClient({
    url : "redis://localhost:6379"
});

await redisClient.connect().then(() => {console.log('TUDO OK')}).catch(err=> console.error(err));

const opts = {
    storeClient: redisClient,
    points: 10,
    duration: 1,
    blockDuration: 60,
    keyPrefix: 'middleware_rate_limite',
    useRedisPackage: true // essa linha foi a solução dos problemas que eu estava tendo com o erro TypeError: this.client.rlflxIncr is not a function
}

const rateLimiterRedis = new RateLimiterRedis(opts);

export default function middlewareRateLimite(req, res, next) { // Começo da estruturação do middleware que impede varias solicitações de um só ip as rotas.

    const UserIP = req.ip;

    rateLimiterRedis.consume(UserIP, 2).then(
        (rateLimiter) => {
            res.setHeader('X-RateLimit-Limit', rateLimiter.points); // Aqui estamos setando um novo cabeçalho informando o limite de requisições que o usuário possui
            res.setHeader('X-RateLimit-Remaining', rateLimiter.remainigPoints); // Setando um cabeçalho informando a quantidade restante de solicitações que o usuário ainda tem
            res.setHeader('X-RateLimit-Reset', new Data(Data.now() + rateLimiter.msBeforeNext)); // Setando um cabeçalho informando o tempo que o limite de requisições será resetado

            return next();
        }
    ).catch(
        (err) => {
            console.error(err);
            
            res.setHeader('Retry-After', Math.round(err.msBeforeNext / 1000)); // Setando um cabeçalho informando o tempo para tentar novamente, basicamente informando em quanto tempo irá resetar o limite de requisição
            res.setHeader('X-RateLimit-Limit', err.points); // setando o cabeçalho para informar o limite de requisições
            res.setHeader('X-RateLimit-Ramaing', 0); // Setando um cabeçalho para informa a quantidade de requisições que o usuário ainda possui

            return res.status(429).json({Erro: "Muitas solicitações Realizadas"});
        }
    )
}
