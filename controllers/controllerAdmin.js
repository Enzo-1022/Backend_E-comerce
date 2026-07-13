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

            req.log.error(
                {
                    Erro : {
                        titulo : "Erro ao Cadastrar Produto",
                        detalhes : AddProduto,
                        ReqID : req.id
                    }
                }
            );

            return res.status(500).json(
                {
                    Erro : {
                        Titulo : "Erro ao Cadastrar o Produto",
                        Menssagem : "Erro interno ao cadastrar produtos no banco de dados",
                        ReqID : req.id
                    }
                }
            );
        }

        req.log.info(
            {
                Acao : "ADD_PRODUTO", 
                Status : 'OK', 
                Detalhes : `Produto adicionado (${req.Id_Produto}) com Sucesso Pelo Usuário ${req.userID}`, 
                IdUsuario : req.userID, 
                IdProduto : req.Id_Produto, 
                ReqID : req.id
            }
        );

        return res.status(201).json( /* Enviando a resposta positiva á requisição */
            {
                IdProduto: AddProduto
            }
        );
        
    } 
    catch (error) 
    {
        req.log.error(
            {
                Erro : { 
                    Titulo : "Erro ao Cadastrar Produto!", 
                    Detalhes : error, 
                    ReqID : req.id 
                }
            }
        );

        return res.status(500).json( /* Caso algum erro aconteça responderemos á requisação com o erro */
            {
                Erro : {
                    Titulo : "Erro Interno do Servidor",
                    Detalhes : "Erro no servidor ao cadastrar o produto",
                    ReqID : req.id
                }
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
            req.log.error(
                {
                    Erro : {
                        Titulo : "Erro ao Atualizar Produto", 
                        Detalhes : AtualizandoProduto, 
                        ReqID : req.id
                    }
                }
            );

            return res.status(500).json(
                {
                    Erro : {
                        Titulo : "Erro ao Atualizar Produto",
                        Detalhes : "Erro interno ao atualizar produto",
                        ReqID : req.id
                    }
                }
            );
        }

        req.log.info(
            {
                Acao : "ATT_PRODUTO", 
                Status : "OK", 
                Detalhes : `Produto (${req.Id_Produto}) Atualizado com Sucesso Pelo Usuário ${req.userID}`, 
                IdUsuario : req.userID, 
                IdProduto : req.Id_Produto, 
                ReqID : req.id
            }
        );

        return res.status(204).end();

    } catch (error) {
        req.log.error(
            {
                Erro : {
                    Titulo : "Erro ao Atualizar Produto", 
                    Detalhes : error, 
                    ReqID : req.id
                }
            }
        );

        return res.status(500).json(
            {
                Erro : {
                    Titulo : "Erro ao Atualizar Produto",
                    Detalhes : "Erro interno ao atualizar produto",
                    ReqID : req.id
                }
            }
        );
    }
}
