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

    async ( req, res, next ) => {
        try 
        {
            let errors = validationResult(req); /* Aqui temos o resultado da validação dos dados dos inputs */

            if (!errors.isEmpty()) /* Verificamos se existe algum erro na validação dos dados dos inputs */
            {
                res.json( /* Caso tenha, respondemos á requisição com o erro */
                    {
                        sucesso : false,
                        message : errors,
                        erro : {
                            status : true,
                            title : 'Erro na validação de dados',
                            message : `${errors}`
                        }
                    }
                );    
            }
            else
            {
                let addProduto = await mProdutos.create( /* Adicionando Produto ao BD */
                    {
                        Nome : req.body.Nome,
                        Descricao : req.body.Descricao,
                        Quantidade : req.body.Quantidade,
                        Preco : req.body.Preco
                    }
                );

               res.json( /* Enviando a resposta positiva á requisição */
                    {
                        sucesso : true,
                        mesage : "Produto Cadastrado Com Sucesso!",
                        erro : {
                            status : false,
                            title : null,
                            message : null
                        }
                    }
                )
            }
        } 
        catch (error) 
        {
            console.error(error)
            res.json( /* Caso algum erro aconteça responderemos á requisação com o erro */
                {
                    sucesso : false,
                    message : error,
                    erro : {
                        status : true,
                        title : "Erro",
                        message : `Um erro inesperado aconteceu! <br/> ${error}`
                    }
                }
            );
        }
    }
];
