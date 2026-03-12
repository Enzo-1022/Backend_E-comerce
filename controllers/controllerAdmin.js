import { body, validationResult } from "express-validator";
import mProdutos from '../models/mProdutos.js';

/* Terminei isso aqui, fiz com sono não testei  12/06/25 */

/* Função de cadastro de produtos */
export const CadastroProdutos = [
    /* Cadeia de validação dos inputs */
    body('Nome').trim().escape().notEmpty(),
    body('Quantidade').trim().escape().notEmpty(),
    body('Descricao').trim().escape().notEmpty(),
    body('Preco').trim().escape().notEmpty(),

    async ( req, res ) => {
        try 
        {
            const Errors = validationResult(req); /* Aqui temos o resultado da validação dos dados dos inputs */

            if (!Errors.isEmpty()) /* Verificamos se existe algum erro na validação dos dados dos inputs */
            {
                return res.stauts(400).json( /* Caso tenha, respondemos á requisição com o erro */
                    {
                        Erro: "Dados Invalidos!"
                    }
                );    
            }

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
            return res.status(500).json( /* Caso algum erro aconteça responderemos á requisação com o erro */
                {
                    Erro : error
                }
            );
        }
    }
];

export const AtualizandoProduto = [ // Criado 12/03/2026, falta validar
    body('Nome').trim().escape().notEmpty(),
    body('Quantidade').trim().escape().notEmpty(),
    body('Descricao').trim().escape().notEmpty(),
    body('Preco').trim().escape().notEmpty(),

    async (req, res) => {
        try {
            const Errors = validationResult(req);

            if (!Errors.isEmpty()) {
                return res.status(400).json({Erro: `Dados Invalidos!`});
            }

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
                return res.status(500).json({Erro : 'Erro ao Atualizar Pedido'});
            }

            return res.status(204);

        } catch (error) {
            return res.status(500).json({Erro: error});
        }
    }
];
