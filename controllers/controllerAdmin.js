import { body, validationResult } from "express-validator";
import mProdutos from '../models/mProdutos.js';

/* Terminei isso aqui, fiz com sono não testei  12/06/25 */

/* Função de cadastro de produtos */
export const cadastroProdutos = [
    /* Cadeia de validação dos inputs */
    body('Nome').trim().escape().notEmpty(),
    body('Quantidade').trim().escape().notEmpty(),
    body('Descricao').trim().escape().notEmpty(),
    body('Preco').trim().escape().notEmpty(),

    async ( req, res ) => {
        try 
        {
            let errors = validationResult(req); /* Aqui temos o resultado da validação dos dados dos inputs */

            if (!errors.isEmpty()) /* Verificamos se existe algum erro na validação dos dados dos inputs */
            {
                return res.stauts(400).json( /* Caso tenha, respondemos á requisição com o erro */
                    {
                        Erro: "Dados Invalidos!"
                    }
                );    
            }

            let addProduto = await mProdutos.create( /* Adicionando Produto ao BD */
                {
                    Nome : req.body.Nome,
                    Descricao : req.body.Descricao,
                    Quantidade : req.body.Quantidade,
                    Preco : req.body.Preco
                }
            );

            return res.status(201).json( /* Enviando a resposta positiva á requisição */
                {
                    IdProduto: addProduto
                }
            )
            
        } 
        catch (error) 
        {
            console.error(error)
            res.status(500).json( /* Caso algum erro aconteça responderemos á requisação com o erro */
                {
                    Erro : `Erro Interno do Servidor! ${error}`
                }
            );
        }
    }
];
