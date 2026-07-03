import { createClient } from "redis";

import { RateLimiterRedis } from "rate-limiter-flexible";

const redisClient = await createClient(
    {
        url : "redis://localhost:6379"
    }
);

//logs para caso de erro
await redisClient.connect().then(() => {console.log('REDIS CONECTADO')}).catch(err=> console.error(err));

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
