import mProdutos from '../models/mProdutos.js';
import { validationResult, body } from 'express-validator';
import mUsuarios from '../models/mUsuarios.js';
import mSessoes from '../models/mSessoes.js';
import mLogins from '../models/mLogins.js'

export async function perfilUsuario (req, res) { // VALIDADO, Feito dia 17/02/2026
    // Callback que retorna as informações do usuario
    try {
        var user = JSON.parse(JSON.stringify(
            await mUsuarios.findByPk(req.userID) // aqui ultilizamos uma técnica que aprendi recentemente que é a gravação de nova infos dentro da requisição, o middleware consegue gravar novos campos com informações dentro da requisição que são acessiveis apartir dos proximos middleware/callback
        ));

        console.log(user) // Parte da Validação

        if(!user){ // Validar realmente se isso está dando certo 
            return res.status(400).json({Erro: `Usuario não encontrado!`});
        }

        return res.status(200).json({PerfilUsuario: user});
    
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
            await mUsuarios.update(
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
];

export async function desativaUsuario (req, res) { // Pequena mudanaça na regra pois antes a tabela que continha a informação se o usuario estava ativo era a própria do usuario alterei isso para a tabela de login
    // Aqui a lógica é a seguinte como estou utlizando JWT tokens para validar a sessão do usuario, eu pensei na seguite lógica como existe um midlleware que valida as sessões com base nos registros do banco de dados quando eu desativar o usuario eu apago esse registro e logo ao tentar acessar qualquer url que dependa de estar logado a api retorna o status não autorizado. Como ele não está logado ele não consegue mais acessar essa rota logo não poderá desativar seu perfil ja estando desativado, ja a lógica para reativar o perfil seria implementada no login do usuário quando ele tentasse entrar novamente cairia navalidação para saber se o usuario esta logado ou não n~so estiver irá exibir a opção de reativação que cairá em outra rota.
    try { // Falta Validar, 100% Validado dia 11/03/2026
        // feito 09/03/2026, falta validar, Validado 11/03/2026
        await mLogins.update({ // Atualizando o Status do Usuário para false
            Ativo: false
        }, {
            where: {
                Id_Usuario: req.userID
            }
        });

        await mSessoes.destroy( // Deletando o Registro da Sessão do Banco de Dados
            {
                where: {
                    Id_Usuario : req.userID
                }
            }
        )

        return res.status(204); // Retornando a Resposta com um status de OK mas sem o body da requisição

    } catch (error) {
        return res.status(500).json({Erro: error});
    }
}

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
