import { createClient } from "redis";

import { RateLimiterRedis } from "rate-limiter-flexible";

import logger from "./logger.config.js";

import 'dotenv/config';

const redisClient = await createClient(
    {
        url : process.env.URLRedis
    }
);

//logs para caso de erro
await redisClient.connect().then(() => {logger.info("REDIS CONECTADO!")}).catch(err=> {logger.error({Err : {Titulo : "Erro de Conexão com o Redis!", Detalhes : err} }); throw new Error(err)});

const opts = {
    storeClient: redisClient,
    points: 10,
    duration: 1,
    blockDuration: 60,
    keyPrefix: 'middleware_rate_limite',
    useRedisPackage: true // essa linha foi a solução dos problemas que eu estava tendo com o erro TypeError: this.client.rlflxIncr is not a function
}

const rateLimiterRedis = new RateLimiterRedis(opts);

export default rateLimiterRedis;
