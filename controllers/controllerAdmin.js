import { body, validationResult } from "express-validator";
import mProdutos from '../models/mProdutos.js';

/* Terminei isso aqui, fiz com sono não testei  12/06/25 */

/* Função de cadastro de produtos */
export async function cadastroProdutos ( req, res ) {
    try 
    {
        const AddProduto = await mProdutos.create( /* Adicionando Produto ao BD */
            {
                Nome : req.body.Nome,
                Descricao : req.body.Descricao,
                Quantidade : req.body.Quantidade,
                Preco : req.body.Preco
            }
        );

        if (!AddProduto){ // Adicionado Dia 12/03/2026, essa é uma validação para saber se a operação no banco de dados foi bem sucedida
            return res.status(500).json({Erro : `Erro ao Cadastrar o Produto`})
        }

        return res.status(201).json( /* Enviando a resposta positiva á requisição */
            {
                IdProduto: AddProduto
            }
        )
        
    } 
    catch (error) 
    {
        console.error(error);

        return res.status(500).json( /* Caso algum erro aconteça responderemos á requisação com o erro */
            {
                Erro : "Erro Interno do Servidor"
            }
        );
    }
}

export async function atualizandoProduto (req, res) {  // Criado 12/03/2026, falta validar
    try {
        const AtualizandoProduto = await mProdutos.update(
            {
                Nome : req.body.Nome,
                Descricao : req.body.Descricao,
                Quantidade : req.body.Quantidade,
                Preco : req.body.Preco
            },
            {
                where : {
                    Id_Produto : req.Id_Produto
                }
            }
        );

        if (!AtualizandoProduto[0]) {
            return res.status(500).json({Erro : 'Erro ao Atualizar Produto'});
        }

        return res.status(204).end();

    } catch (error) {
        console.error(error);

        return res.status(500).json({Erro: "Erro Interno do Servidor"});
    }
}
