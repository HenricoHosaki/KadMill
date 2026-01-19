import { OrdemServico } from '@prisma/client';
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

            // --- CORREÇÃO IMPORTANTE: Converter Datas ---
            // O frontend envia texto (ex: "2026-01-17"), o banco precisa de Data real.
            if (ordemServico.data_abertura) {
                ordemServico.data_abertura = new Date(ordemServico.data_abertura);
            }
            if (ordemServico.data_fechamento) {
                ordemServico.data_fechamento = new Date(ordemServico.data_fechamento);
            }
            // -------------------------------------------

            const ordemServicoCriada = await ordemServicoService.adicionarOrdemServico(ordemServico)

            if(!ordemServicoCriada){
                return res.status(400).json({
                    message: "Informações inválidas"
                })
            }

            return res.status(201).json({
                message: "Ordem de serviço registrada com sucesso"
            })
        }catch(err: any){
            // Adicionei este log para você ver o erro real no terminal se acontecer de novo
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

            // --- ADICIONE ESTE BLOCO DE CONVERSÃO DE DATA ---
            if (ordemServico.data_abertura && typeof ordemServico.data_abertura === 'string') {
                ordemServico.data_abertura = new Date(ordemServico.data_abertura);
            }
            if (ordemServico.data_fechamento && typeof ordemServico.data_fechamento === 'string') {
                ordemServico.data_fechamento = new Date(ordemServico.data_fechamento);
            }
            // ------------------------------------------------

            const ordemServicoAtualizada = await ordemServicoService.atualizarOrdemServico(idConvertido, ordemServico)

            if(!ordemServicoAtualizada){
                return res.status(404).json({ message: "Não foi possível atualizar a ordem de serviço" })
            }

            return res.status(200).json({ message: "Ordem de serviço atualizada" })
        }catch(err: any){ // Adicione :any para o TypeScript não reclamar
            console.error("ERRO AO ATUALIZAR OS:", err); // Log para ver o erro real no terminal
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
