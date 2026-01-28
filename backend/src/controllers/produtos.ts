import { ProdutoService } from './../services/produtos';
import { Request, Response } from 'express';
const produtoService = new ProdutoService();

/**
 * Controller responsável pelo controle de Produtos do sistema
 * Gerencia as requisições para criação, listagem, edição e exclusão de Produtos
 */
export class ProdutoController {

    async pegarTodosProdutos(req: Request, res: Response) {
        try {
            const produtos = await produtoService.pegarTodosProdutos();
 
            return res.status(200).json(produtos);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    async pegarProdutoPorId(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const produto = await produtoService.pegarProdutoPorId(idConvertido);

            if(!produto){
                return res.status(404).json({
                    message: "Produto não encontrado"
                })
            }

            return res.status(200).json(produto)
        }catch(err){
            return res.status(500).json({
                message: "Erro ao encontrar ID de produto"
            })
        }
    }

    async criarProduto(req: Request, res: Response) {
        try{
            const produto = req.body

            if(produto.data_registro && typeof produto.data_registro === 'string'){
                produto.data_registro = new Date(produto.data_registro);
            }

            const produtoCriado = await produtoService.adicionarProduto(produto)

            if(!produtoCriado){
                return res.status(400).json({ message: "Informações inválidas" })
            }
            return res.status(201).json({ message: "Produto registrado com sucesso" })
        }catch(err: any){
            console.error("Erro Produto:", err);
            res.status(500).json({ message: "Erro interno do servidor", error: err.message })
        }
    }

    async atualizarProduto(req: Request, res: Response) {
        try{
            const { id } = req.params
            const produto = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            const produtoAtualizado = await produtoService.atualizarProduto(idConvertido, produto)

            if(!produtoAtualizado){
                return res.status(404).json({
                    message: "Não foi possível atualizar o produto"
                })
            }

            return res.status(200).json({
                message: "Produto atualizado"
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async deletarProduto(req: Request, res: Response) {
        try{
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
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
