import express from 'express';

export async function catalogo (req, res, next) {
    try 
    {
        console.log(req.cookies);
        res.json(
            { 
                Produtos : 
                    [
                        {
                            "NomeProduto": "Tezste",
                            "Id_Produto" : 1
                        }
                    ]
            }
        ) 
    } 
    catch (error) 
    {
        next(error);
    }
}
