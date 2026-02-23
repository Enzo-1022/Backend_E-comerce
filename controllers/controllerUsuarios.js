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

        if(!user){
            return res.status(400).json({Erro: `Usuario não encontrado!`})
        }

        return res.status(200).json({PerfilUsuario: user})
    
    } catch (error) {
        return res.status(500).json({Erro: `Erro Interno do Servidor! ${error}`});
    }
}

export const AttInfosUsuario = [
    body('Cpf').trim().escape().notEmpty(),
    body('Data_Nascimento').trim().escape().notEmpty(),
    body('Nome').trim().escape().notEmpty(),

    (req, res) => {
        try {
            var errors = validationResult(req)

            if(!errors.isEmpty())
            {
                return res.status(400).json(`Má requisição, ${errors}`);   
            }

            // Parei aqui falta adicionar a funcionalidade de atualização do registro
            var attUsuario = Usuarios.update(
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
            )

            console.log(attUsuario)
            // Falta Terminar e Validar 18/02/2026.
            res.status(204)
        } catch (error) {
            return res.status(500).json({Erro: `Erro interno do servidor! ${error}`})
        }
    }
]

export async function catalogo (req, res) {
    try 
    {
        const Catalogo = JSON.parse(JSON.stringify( // Conversão para objeto js
            await mProdutos.findAll() // Buscando todos os produtos
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
