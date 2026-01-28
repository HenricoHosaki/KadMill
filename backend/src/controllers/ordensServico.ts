import { OrdemServico } from '@prisma/client';
import { OrdemServicoService } from './../services/ordensServico';
import { Request, Response } from 'express';
const ordemServicoService = new OrdemServicoService();

/**
 * Controller responsável pelo controle da Ordem de serviço do sistema
 * Gerencia as requisições para criação, listagem, edição e exclusão da Ordem de serviço
 */
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

            // -- CONVERSÃO DE DATAS -- //
            if (ordemServico.data_abertura) ordemServico.data_abertura = new Date(ordemServico.data_abertura);
            if (ordemServico.data_fechamento) ordemServico.data_fechamento = new Date(ordemServico.data_fechamento);
            if (ordemServico.inicio_servico) ordemServico.inicio_servico = new Date(ordemServico.inicio_servico);
            if (ordemServico.fim_servico) ordemServico.fim_servico = new Date(ordemServico.fim_servico);
            if (ordemServico.quantidade_esperada) {
                ordemServico.quantidade_esperada = Number(ordemServico.quantidade_esperada);
            }
            
            if (ordemServico.tempo_total_execucao) {
                ordemServico.tempo_total_execucao = Number(ordemServico.tempo_total_execucao);
            }
            if (ordemServico.valor_total) {
                ordemServico.valor_total = Number(ordemServico.valor_total);
            }
            if (ordemServico.clienteId) {
                ordemServico.clienteId = Number(ordemServico.clienteId);
            }

            const ordemServicoCriada = await ordemServicoService.adicionarOrdemServico(ordemServico)

            if(!ordemServicoCriada){
                return res.status(400).json({ message: "Informações inválidas" })
            }

            return res.status(201).json({ message: "Ordem de serviço registrada com sucesso" })
        }catch(err: any){
            console.error("ERRO DETALHADO AO CRIAR OS:", err); 
            res.status(500).json({
                message: "Erro interno do servidor. Verifique o terminal para detalhes.",
                error: err.message 
            })
        }
    }
    
    async atualizarOrdemServico(req: Request, res: Response) {
        try{
            const { id } = req.params
            const ordemServico = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({ message: "Formato de ID inválido" })
            }

            // -- CONVERSÃO DE DATA -- //
            if (ordemServico.data_abertura && typeof ordemServico.data_abertura === 'string') {
                ordemServico.data_abertura = new Date(ordemServico.data_abertura);
            }
            if (ordemServico.data_fechamento && typeof ordemServico.data_fechamento === 'string') {
                ordemServico.data_fechamento = new Date(ordemServico.data_fechamento);
            }
            if (ordemServico.inicio_servico && typeof ordemServico.inicio_servico === 'string') {
        ordemServico.inicio_servico = new Date(ordemServico.inicio_servico);
        if (ordemServico.quantidade_esperada) {
                ordemServico.quantidade_esperada = Number(ordemServico.quantidade_esperada);
            }
    }
    if (ordemServico.fim_servico && typeof ordemServico.fim_servico === 'string') {
        ordemServico.fim_servico = new Date(ordemServico.fim_servico);
    }
            const ordemServicoAtualizada = await ordemServicoService.atualizarOrdemServico(idConvertido, ordemServico)

            if(!ordemServicoAtualizada){
                return res.status(404).json({ message: "Não foi possível atualizar a ordem de serviço" })
            }

            return res.status(200).json({ message: "Ordem de serviço atualizada" })
        }catch(err: any){
            console.error("ERRO AO ATUALIZAR OS:", err);
            return res.status(500).json({
                message: "Erro interno do servidor",
                error: err.message
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

            const ordemServicoDeletada = await ordemServicoService.deletarOrdemServico(idConvertido)

            return res.status(200).json({
                message: "Ordem de serviço deletado com sucesso",
                ordemServico: ordemServicoDeletada
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
