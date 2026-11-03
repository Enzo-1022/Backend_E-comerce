export default class JsonRes {
    ResError = {
        Titulo : "",
        Detalhes : ""
    }
    reqId = "";

    /**
     * 
     * @param {*} pTitulo 
     * @param {*} pDetalhes 
     * @param {*} pReqId 
    */
    constructor(pTitulo, pDetalhes, pReqId){
        this.ResError = {
            Titulo : pTitulo,
            Detalhes : pDetalhes
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
    static resError(pTitulo, pDetalhes, pReqId) {
        const novaRes = new JsonRes(pStatus, pTitulo, pDetalhes, pReqId);

        return novaRes.construindoRes()
    } 
}