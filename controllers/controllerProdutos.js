import { body, validationResult } from "express-validator";
import mProdutos from "../models/mProdutos.js";

export async function catalogo(req, res) { // Validar
    try {
        const QtdProdutos = await mProdutos.count();

        var qtdPaginas;
        
        if (QtdProdutos >= 15) // Calculo de paginas com base nos produtos cadastrados no banco
        {
            if (QtdProdutos % 15){
                qtdPaginas = Math.ceil(QtdProdutos / 15);
            }
            else {
                qtdPaginas = QtdProdutos / 15;
            }
        }
        else {
            qtdPaginas = 1
        }


        if(!req.PaginaRequerida){
            const Produtos = await mProdutos.findAll({limit : 15});

            return res.status(200).json({Produtos: await Produtos.toJSON(), QtdPaginas : qtdPaginas});
        }

        const Produtos = await mProdutos.findAll({limit : 15, offset : req.PaginaRequerida * 15});

        return res.status(200).json({Produtos: await Produtos.toJSON(), QtdPaginas : qtdPaginas});

    } catch (error) {
        return res.status(500).json({Erro: error});
    }
};

export async function produto(req, res){
    try {
        const Produto = await mProdutos.findAll({
            where : {
                Id_Produto : req.Id_Produto
            }
        });

        if (!Produto.length) {
            return res.status(404).json({Erro : "Falha ao Encontrar Produto"});
        }

        return res.status(200).json({Produto : Produto.toJSON()});

    } catch (error) {
        return res.status(500).json({ Erro: error });
    }
}