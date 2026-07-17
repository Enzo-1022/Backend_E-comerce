import { body, validationResult } from "express-validator";
import mProdutos from "../models/mProdutos.js";

import produtos from "../Services/produtos.js";

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

        if (!Produto.length) {

            req.log.error(
                {
                    Acao : "BuscaDeProduto",
                    Status : "ERRO",
                    Erro : {
                        Titulo : "Produto não encontrado",
                        Detalhes : `Id do Produto ${req.Id_produto}, Resultado da Busca: ${Produto}`
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
        return res.status(500).json(
            {
                Erro : {
                    Titulo : "",
                    Detalhes : ""
                } 
            }
        );
    }
}
