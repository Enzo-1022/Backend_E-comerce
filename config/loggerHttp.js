import pinoHttp from "pino-http";

const loggerHttp = pinoHttp(
    {
        serializers :{
            req : (req) => ({method : req.method}),
            res : (res) => ({statusCode : res.statusCode})
        },
        transport : { // Em ambiente de Produção deixar os Logs sem o Pino-Pretty
            target : 'pino-pretty',
            options : {
                colorize : true,
                traslateTime : 'SS:yyyy-mm-dd HH:MM:SS',
            }
        }
    }
);

export default loggerHttp;
