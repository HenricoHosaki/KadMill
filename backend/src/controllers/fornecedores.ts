import { FornecedorService } from './../services/fornecedores';
import { Request, Response } from 'express';
const fornecedorService = new FornecedorService();

/**
 * Controller do Fornecedor
 */
export class FornecedorController {

    async pegarTodosFornecedores(req: Request, res: Response) {
        try {
            const fornecedores = await fornecedorService.pegarTodosFornecedores();
 
            return res.status(200).json(fornecedores);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    async pegarFornecedorPorId(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const fornecedor = await fornecedorService.pegarFornecedorPorId(idConvertido);

            if(!fornecedor){
                return res.status(404).json({
                    messsage: "Fornecedor não encontrado"
                })
            }

            return res.status(200).json(fornecedor)
        }catch(err){
            return res.status(500).json({
                message: "Erro ao encontrar ID de fornecedor"
            })
        }
    }

    async criarFornecedor(req: Request, res: Response) {
        try{
            const fornecedor = req.body
            const fornecedorCriado = await fornecedorService.adicionarFornecedor(fornecedor)

            if(!fornecedorCriado){
                return res.status(400).json({
                    message: "Informações inválidas"
                })
            }

            return res.status(201).json({
                message: "Fornecedor registrado com sucesso"
            })
        }catch(err){
            res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async atualizarFornecedor(req: Request, res: Response) {
        try{
            const { id } = req.params
            const fornecedor = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            const fornecedorAtualizado = await fornecedorService.atualizarFornecedor(idConvertido, fornecedor)

            if(!fornecedorAtualizado){
                return res.status(404).json({
                    message: "Não foi possível atualizar o fornecedor"
                })
            }

            return res.status(200).json({
                message: "Fornecedor atualizado"
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async deletarFornecedor(req: Request, res: Response) {
        try{
            const { id } = req.params
            const idConvertido = Number(id)
            
            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Não foi possível deletar o fornecedor"
                })
            }

            const fornecedorDeletado = await fornecedorService.deletarFornecedor(idConvertido)

            return res.status(200).json({
                message: "Fornecedor deletado com sucesso",
                fornecedor: fornecedorDeletado
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
