export default class Produtos {
    #modeloProduto

    constructor(pModeloProduto) {
        this.#modeloProduto = pModeloProduto;
    }

    /**
     * Método que busca produtos com base na paginação
     * 
     * @param {*} pNumPagRequirida - Numero da Pagina que a função Buscará
     * @returns - Json com os produtos 
     */
    async buscaProdutos(pNumPagRequirida) {
        try {
            const qtdProdutos = await this.#modeloProduto.count();

            var qtdPaginas;

            if (qtdProdutos >= 15) // Calculo de paginas com base nos produtos cadastrados no banco
            {
                if (qtdProdutos % 15) {
                    qtdPaginas = Math.ceil(qtdProdutos / 15);
                }
                else {
                    qtdPaginas = qtdProdutos / 15;
                }
            }
            else {
                qtdPaginas = 1;
            }

            if(!pNumPagRequirida) {
                const produtos = await this.#modeloProduto.findAll(
                    {
                        limit : 15, 
                        raw : true
                    }
                );

                return {
                    Produtos: produtos, 
                    QtdPaginas : qtdPaginas
                };
            }

            const produtos = await this.#modeloProduto.findAll(
                {
                    limit : 15, 
                    offset : req.PaginaRequerida * 15,
                    raw : true
                }
            );

            return {
                produtos : produtos,
                QtdPaginas : qtdPaginas
            }

        } catch (error) {
            throw new Error(error);  
        }
    }

    /**
     * Método que busca um produto 
     *
     * @param {*} pIdProduto - Id do Produto que iremos buscar
     * @returns - Json com os Dados do Produto ou um erro
    */
    async buscaProduto(pIdProduto){
        try {
            const produto = await this.#modeloProduto.findAll(
                {
                    where : {
                        Id_Produto : pIdProduto
                    },
                    raw : true
                }
            );

            return produto;
        } catch (error) {
            throw new Error(error);
        }
    }
}
