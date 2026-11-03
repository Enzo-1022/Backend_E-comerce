export default class Logger {
    configLoggerErro500 = {
        Acao : "",
        Status : "ERRO",
        ReqID : "",
        Titulo : "Erro Interno do Servidor",
        err : ""
    }

    constructor(pAcao, pErroDetalhes) {
        this.configLoggerErro500 = {
            Acao : pAcao,
            Status : "ERRO",
            ReqID : pReq.id,
            Titulo : "Erro Interno do Servidor",
            err : pErroDetalhes
        }
    }

    /**
     * Método que realiza o log de erro Interno do Servidor, todo erro do try catch que estamos respondendo com 500
     * @param {*} pReq - Objeto da Requisição
     * @param {*} pAcao - Nome da ação onde o erro ocorreu
     * @param {*} pDetalhes - o Erro
     * @returns - Void
    */
    static logError(pReq, pAcao, pDetalhes) {
        const novoLogger = new Logger(pAcao, pDetalhes);

        pReq.log.error(novoLogger.configLogger);

        return;
    }
}