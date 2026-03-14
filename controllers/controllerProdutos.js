import mProdutos from "../models/mProdutos.js";

export async function catalogo(req, res) {
    try {
        const Produtos = await mProdutos.findAll();

        return res.status(200).json({Produtos: Produtos.toJSON()});

    } catch (error) {
        return res.status(500).json({Erro: error})
    }
}

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