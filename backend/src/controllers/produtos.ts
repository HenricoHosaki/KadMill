import { ProdutoService } from './../services/produtos';
import { Request, Response } from 'express';

const produtoService = new ProdutoService();

export class ProdutoServiceController {

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
                    messsage: "Produto não encontrado"
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
            const criarProduto = await produtoService.adicionarProduto(produto)

            if(!criarProduto){
                return res.status(400).json({
                    message: "Informações inválidas"
                })
            }

            return res.status(201).json({
                message: "Produto registrado com sucesso"
            })
        }catch(err){
            res.status(500).json({
                message: "Erro interno do servidor"
            })
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
            
            const atualizarProduto = await produtoService.atualizarProduto(idConvertido, produto)

            if(!atualizarProduto){
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

            const deletarProduto = await produtoService.deletarProduto(idConvertido)

            return res.status(200).json({
                message: "Produto deletado com sucesso",
                produto: deletarProduto
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
