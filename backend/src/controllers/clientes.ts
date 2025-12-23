import { ClienteService } from './../services/clientes';
import { Request, Response } from 'express';

const clienteService = new ClienteService();

export class ClienteController {

    async pegarTodosClientes(req: Request, res: Response) {
        try {
            const clientes = await clienteService.pegarTodosClientes();
 
            return res.status(200).json(clientes);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    async pegarClientePorId(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const cliente = await clienteService.pegarClientePorId(idConvertido);

            if(!cliente){
                return res.status(404).json({
                    messsage: "Cliente não encontrado"
                })
            }

            return res.status(200).json(cliente)
        }catch(err){
            return res.status(500).json({
                message: "Erro ao encontrar ID de cliente"
            })
        }
    }

    async criarCliente(req: Request, res: Response) {
        try{
            const cliente = req.body
            const registrarCliente = await clienteService.adicionarCliente(cliente)

            if(!registrarCliente){
                return res.status(400).json({
                    message: "Informações inválidas"
                })
            }

            return res.status(201).json({
                message: "Cliente registrado com sucesso"
            })
        }catch(err){
            res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async atualizarUsuario(req: Request, res: Response) {
        try{
            const { id } = req.params
            const cliente = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            const clienteAtualizado = await clienteService.atualizarCliente(idConvertido, cliente)

            if(!clienteAtualizado){
                return res.status(404).json({
                    message: "Não foi possível atualizar o cliente"
                })
            }

            return res.status(200).json({
                message: "cliente atualizado"
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async deletarUsuario(req: Request, res: Response) {
        try{
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
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
