import mProdutos from "../models/Produtos.model.js";

import produtos from "../Services/Produtos.service.js";

const Produtos = new produtos(mProdutos);

export async function catalogo(req, res) { // Validar
    try {
        const produtos = await Produtos.buscaProdutos(req.PaginaRequerida);
        
        res.status(200).json(produtos);

    } catch (error) {
        req.log.error(
            {
                Acao : "CATALOGO",
                Status : "ERRO",
                Erro : {
                    Titulo : "Erro ao Buscar Catalogo",
                    Detalhes : error,
                    ReqID : req.id
                }
            }
        );

        return res.status(500).json(
            {
                Erro : {
                    Titulo : "Erro ao Buscar Catalogo",
                    Detalhes : "Erro inesperado ao Buscar Catalogo",
                    ReqID : req.id
                }
            }
        );
    }
};

export async function produto(req, res){
    try {
        const produto = await Produtos.buscaProduto(req.Id_Produto);

        if (!produto.length) {

            req.log.error(
                {
                    Acao : "BuscaDeProduto",
                    Status : "ERRO",
                    Erro : {
                        Titulo : "Produto não encontrado",
                        Detalhes : `Id do Produto ${req.Id_produto}, Resultado da Busca: ${produto}`,
                        ReqID : req.id
                    }
                }
            );

            return res.status(404).json(
                {
                    Erro : {
                        Titulo : "Falha ao Encontrar o Produto",
                        Detalhes : "Não conseguimos encontrar o produto em nossa base de dados",
                        ReqID : req.id
                    }
                }
            );
        }

        return res.status(200).json(
            {
                Produto : produto
            }
        );

    } catch (error) {

        res.log.error(
            {
                Acao : "BUSCAR_PRODUTO",
                Status : "ERRO",
                Erro : {
                    Titulo : `Erro ao Buscar Produto ${req.Id_Produto}`,
                    Detalhes : error,
                    ReqID : req.id
                }
            }
        )

        return res.status(500).json(
            {
                Erro : {
                    Titulo : `Erro Ao Buscar o Produto ${req.Id_Produto}`,
                    Detalhes : "Erro interno no servidor ao tentar buscar o produto.",
                    ReqID : req.id
                } 
            }
        );
    }
}
