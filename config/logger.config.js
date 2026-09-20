import pino from "pino";

const logger = pino(
    {
        transport : {
            target : 'pino-pretty',
            options : {
                translateTime : 'SS:yyyy-mm-dd HH:MM:SS'
            }
        }
    }
);

export default logger;
