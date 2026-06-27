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
        (tt) => {
            console.log(tt)
            next()
        }
    ).catch(
        (err) => {
            console.error(err)
            res.status(429).json({Erro: err});
        }
    )
}
