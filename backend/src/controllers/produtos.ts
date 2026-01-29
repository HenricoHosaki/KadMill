import { ProdutoService } from './../services/produtos';
import { Request, Response } from 'express';
const produtoService = new ProdutoService();

/**
 * Controller responsável pelo controle de Produtos do sistema
 * Gerencia as requisições para criação, listagem, edição e exclusão de Produtos
 */
export class ProdutoController {

    async pegarTodosProdutos(req: Request, res: Response) {
            
            const produtos = await produtoService.pegarTodosProdutos();
 
            return res.status(200).json(produtos);
    }

    async pegarProdutoPorId(req: Request, res: Response) {
        
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const produto = await produtoService.pegarProdutoPorId(idConvertido);

            return res.status(200).json(produto)
    }

    async criarProduto(req: Request, res: Response) {
    
            const produto = req.body

            if(produto.data_registro && typeof produto.data_registro === 'string'){
                produto.data_registro = new Date(produto.data_registro);
            }

            await produtoService.adicionarProduto(produto)

            return res.status(201).json({ message: "Produto registrado com sucesso" })
    }

    async atualizarProduto(req: Request, res: Response) {
            const { id } = req.params
            const produto = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            await produtoService.atualizarProduto(idConvertido, produto)

            return res.status(200).json({
                message: "Produto atualizado"
            })
    }

    async deletarProduto(req: Request, res: Response) {

            const { id } = req.params
            const idConvertido = Number(id)
            
            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Não foi possível deletar o produto"
                })
            }

            const produtoDeletado = await produtoService.deletarProduto(idConvertido)

            return res.status(200).json({
                message: "Produto deletado com sucesso",
                produto: produtoDeletado
            })
    }
}
