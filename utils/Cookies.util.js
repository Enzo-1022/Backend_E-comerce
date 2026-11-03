/**
 * Classe que centraliza a criação dos cookies 
*/
export default class Cookies {

    configDosCookies = {
        path : '/', // Torna o Cookie acessivel em toda a aplicação
        secure : false, //Isso faz com que o cookie so seja enviado atraves de uma requisição https, se true, se false o cookie pode ser enviado via http
        httpOnly : false, //Dps nos muda para true pois isso evita que o cookie seja acessivel via JS
        sameSite : 'lax' // Lax deixa o cookie acessivel para urls diferentes da nossa mesma
    };

    /**
     * Método que adiciona há resposta o cookie com o token de acesso
     * 
     * @param {*} res - Objeto de resposta do próprio express
     * @param {*} acessToken - Acess token que iremos definir como conteudo do cookie
    */
    static AcessToken(res, acessToken) {
        res.cookie(
            'acessToken', // Definindo o nome do Cookie
            acessToken, // Conteudo do Cookie, atribuindo o token de sessão para o cookie
            this.configDosCookies
        );

        return;
    }

    /**
     * Método que adiciona há resposta o cookie com o token de Sessão / Refresh Token 
     * 
     * @param {*} res - Objeto de Resposta do próprio Express
     * @param {*} sessionToken - Token de Sessão que iremos definir como conteudo do cookie
    */
    static SessionToken(res, sessionToken) {
        res.cookie(
            'sessionToken', // Definindo o nome do Cookie
            sessionToken, // Conteudo do Cookie, atribuindo o token de sessão para o cookie
            this.configDosCookies
        );
    }

    /**
     * Método que adiciona há resposta da requisição o cookie de autenticação para a reativação do perfil do usuário
     * 
     * @param {*} res 
     * @param {*} tokenReativacao 
    */
    static ReativacaoToken(res, tokenReativacao) {
        res.cookie(
            'tokenDeReativacao',
            tokenReativacao,
            this.configDosCookies
        );
    }

    /**
     * 
     * @param {*} res 
     * @returns 
     */
    static ApagaCookiesSessao(res) {
        res.clearCookie("sessionToken");
        res.clearCookie("acessToken");

        return;

    }
}
