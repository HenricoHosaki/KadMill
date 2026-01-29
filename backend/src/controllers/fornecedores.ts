import { FornecedorService } from './../services/fornecedores';
import { Request, Response } from 'express';
const fornecedorService = new FornecedorService();

/**
 * Controller responsável pelo controle de Fornecedores do sistema
 * Gerencia as requisições para criação, listagem, edição e exclusão de Fornecedores
 */
export class FornecedorController {

    async pegarTodosFornecedores(req: Request, res: Response) {
            const fornecedores = await fornecedorService.pegarTodosFornecedores();
 
            return res.status(200).json(fornecedores);
    }

    async pegarFornecedorPorId(req: Request, res: Response) {
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const fornecedor = await fornecedorService.pegarFornecedorPorId(idConvertido);

            return res.status(200).json(fornecedor) 
    }

    async criarFornecedor(req: Request, res: Response) {
            const fornecedor = req.body
            await fornecedorService.adicionarFornecedor(fornecedor)

            return res.status(201).json({
                message: "Fornecedor registrado com sucesso"
            })
    }

    async atualizarFornecedor(req: Request, res: Response) {
            const { id } = req.params
            const fornecedor = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            await fornecedorService.atualizarFornecedor(idConvertido, fornecedor)

            return res.status(200).json({
                message: "Fornecedor atualizado"
            })
    }

    async deletarFornecedor(req: Request, res: Response) {
        
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
    }
}
