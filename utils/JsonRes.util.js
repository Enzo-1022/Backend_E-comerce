export default class JsonRes {
    ResError = {
        Titulo : "",
        Detalhes : ""
    }
    reqId = "";

    /**
     * 
     * @param {*} pAcao
     * @param {*} pReqId 
    */
    constructor(pAcao, pReqId){
        this.ResError = {
            Titulo : "Erro Interno do Servidor",
            Detalhes : `Um erro inesperado ocorreu ao tentar realizar a ação de ${pAcao}`
        };
        this.reqId = pReqId;
    }


    /**
     * 
     * @returns 
    */
    construindoRes(){
        return {
            Error : this.ResError,
            ReqId : this.reqId
        }
    }

    /**
     * 
    */
    static resError(pAcao, pReqId) {
        const novaRes = new JsonRes(pAcao, pReqId);

        return novaRes.construindoRes();
    } 
}