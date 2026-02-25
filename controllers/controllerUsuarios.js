import mProdutos from '../models/mProdutos.js';
import { validationResult, body } from 'express-validator';
import mUsuarios from '../models/mUsuarios.js';
import Usuarios from '../models/mUsuarios.js';

export async function perfilUsuario (req, res) { // VALIDADO, Feito dia 17/02/2026
    // Callback que retorna as informações do usuario
    try {
        var user = JSON.parse(JSON.stringify(
            await mUsuarios.findByPk(req.userID) // aqui ultilizamos uma técnica que aprendi recentemente que é a gravação de nova infos dentro do 
        ));

        if(!user){ // Validar realmente se isso está dando certo 
            return res.status(400).json({Erro: `Usuario não encontrado!`})
        }

        return res.status(200).json({PerfilUsuario: user})
    
    } catch (error) {
        return res.status(500).json({Erro: `Erro Interno do Servidor! ${error}`});
    }
}

export const AttInfosUsuario = [ // Validar

    body('Cpf').trim().escape().notEmpty(),
    body('Data_Nascimento').trim().escape().notEmpty(),
    body('Nome').trim().escape().notEmpty(),

    async (req, res) => {
        try {
            var errors = validationResult(req)

            if(!errors.isEmpty())
            {
                return res.status(400).json(`Má requisição, ${errors}`);   
            }

            // Validar como o Sequelize nos traz os erros para add um tratamento para esse possiveis erros
            await Usuarios.update(
                {
                    Nome : req.body.Nome,
                    Data_Nascimento : req.body.Data_Nascimento,
                    Cpf : req.body.Cpf
                },
                {
                    where : {
                        Id_Usuario : req.userID
                    }
                }
            );
            // Falta Terminar e Validar 18/02/2026.

            return res.status(204) // 204 é um código de sucesso mas que não envia nenhum conteudo em seu corpo.

        } catch (error) {
            return res.status(500).json({Erro: error});
        }
    }
]

export async function catalogo (req, res) {
    try 
    {
        const Catalogo = JSON.parse(JSON.stringify( // Conversão para objeto js
            await mProdutos.findAll() // Buscando todos os produtos, buscar todos os produtos não é uma boa pratica caso possua um numero muito elevado de registros isso interfere diretamente na performance do banco de dados e do backend
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
