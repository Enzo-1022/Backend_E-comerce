import mProdutos from '../models/mProdutos.js';

export async function catalogo (req, res, next) {
    try 
    {
        const Catalogo = JSON.parse(JSON.stringify( // Conversão para objeto js
            await mProdutos.findAll() // Buscando todos os produtos
        ));

        return res.status(200).json( // Respondendo a requisição com o status 200 ok, e enviando os prudutos
            { 
                Produtos : await Catalogo
            }
        ) 
    } 
    catch (error) 
    {
        // Caso ocorra algum erro respondemos há requisição com o Status 500 erro interno do servidor
        return res.status(500).json({ Erro : `Erro Interno do servidor, Tente novamente! </br> ${error}` });
    }
}
