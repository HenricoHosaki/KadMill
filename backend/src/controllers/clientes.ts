import { ClienteService } from './../services/clientes';
import { Request, Response } from 'express';
const clienteService = new ClienteService();

/**
 * Controller responsável pelo controle de Clientes do sistema
 * Gerencia as requisições para criação, listagem, edição e exclusão de Clientes
 */
export class ClienteController {

    async pegarTodosClientes(req: Request, res: Response) {
            const clientes = await clienteService.pegarTodosClientes();
 
            return res.status(200).json(clientes);
    }

    async pegarClientePorId(req: Request, res: Response) {
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const cliente = await clienteService.pegarClientePorId(idConvertido);

            return res.status(200).json(cliente)
    }

    async criarCliente(req: Request, res: Response) {
            const cliente = req.body
            await clienteService.adicionarCliente(cliente)

            return res.status(201).json({
                message: "Cliente registrado com sucesso"
            })
    }

    async atualizarUsuario(req: Request, res: Response) {
            const { id } = req.params
            const cliente = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            await clienteService.atualizarCliente(idConvertido, cliente)

            return res.status(200).json({
                message: "cliente atualizado"
            })
    }

    async deletarUsuario(req: Request, res: Response) {
            const { id } = req.params
            const idConvertido = Number(id)
            
            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Não foi possível deletar o cliente"
                })
            }

            const clienteDeletado = await clienteService.deletarCliente(idConvertido)

            return res.status(200).json({
                message: "Cliente deletado com sucesso",
                usuario: clienteDeletado
            })
    }
}
