import { OrdemServicoService } from './../services/ordensServico';
import { Request, Response } from 'express';

const ordemServicoService = new OrdemServicoService();

export class OrdemServicoController {

    async pegarTodosOrdemServico(req: Request, res: Response) {
        try {
            const ordemServico = await ordemServicoService.pegarTodasOrdensServicos();
 
            return res.status(200).json(ordemServico);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    async pegarOrdemServicoPorId(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const ordemServico = await ordemServicoService.pegarOrdemServicoPorId(idConvertido);

            if(!ordemServico){
                return res.status(404).json({
                    messsage: "Ordem de serviço não encontrada"
                })
            }

            return res.status(200).json(ordemServico)
        }catch(err){
            return res.status(500).json({
                message: "Erro ao encontrar ID de ordem de serviço"
            })
        }
    }

    async criarOrdemServico(req: Request, res: Response) {
        try{
            const ordemServico = req.body
            const criarOrdemServico = await ordemServicoService.adicionarOrdemServico(ordemServico)

            if(!criarOrdemServico){
                return res.status(400).json({
                    message: "Informações inválidas"
                })
            }

            return res.status(201).json({
                message: "Ordem de serviço registrada com sucesso"
            })
        }catch(err){
            res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async atualizarOrdemServico(req: Request, res: Response) {
        try{
            const { id } = req.params
            const ordemServico = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            const atualizarOrdemServico = await ordemServicoService.atualizarOrdemServico(idConvertido, ordemServico)

            if(!atualizarOrdemServico){
                return res.status(404).json({
                    message: "Não foi possível atualizar a ordem de serviço"
                })
            }

            return res.status(200).json({
                message: "Ordem de serviço atualizada"
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async deletarOrdemServico(req: Request, res: Response) {
        try{
            const { id } = req.params
            const idConvertido = Number(id)
            
            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Não foi possível deletar a ordem de serviço"
                })
            }

            const deletarOrdemServico = await ordemServicoService.deletarOrdemServico(idConvertido)

            return res.status(200).json({
                message: "Ordem de serviço deletado com sucesso",
                ordemServico: deletarOrdemServico
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
