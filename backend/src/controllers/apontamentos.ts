import { ApontamentoService } from './../services/apontamentos';
import { Request, Response } from 'express';

const apontamentoService = new ApontamentoService();

export class ApontamentoController {

    async pegarTodosApontamentos(req: Request, res: Response) {
        try {
            const apontamentos = await apontamentoService.pegarTodosApontamentos();
 
            return res.status(200).json(apontamentos);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    async pegarApontamentoPorId(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const apontamento = await apontamentoService.pegarApontamentoPorId(idConvertido);

            if(!apontamento){
                return res.status(404).json({
                    messsage: "apontamento não encontrado"
                })
            }

            return res.status(200).json(apontamento)
        }catch(err){
            return res.status(500).json({
                message: "Erro ao encontrar ID de apontamento"
            })
        }
    }

    async criarApontamento(req: Request, res: Response) {
        try{
            const apontamento = req.body

            // --- CORREÇÃO DE DATA ---
            if(apontamento.data_apontamento && typeof apontamento.data_apontamento === 'string'){
                apontamento.data_apontamento = new Date(apontamento.data_apontamento);
            }
            if (apontamento.inicio_trabalho) apontamento.inicio_trabalho = new Date(apontamento.inicio_trabalho);
    if (apontamento.fim_trabalho) apontamento.fim_trabalho = new Date(apontamento.fim_trabalho);
            // ------------------------

            const apontamentoCriado = await apontamentoService.criarApontamento(apontamento)

            if(!apontamentoCriado){
                return res.status(400).json({ message: "Informações inválidas" })
            }
            return res.status(201).json({ message: "Apontamento registrado com sucesso" })
        }catch(err: any){
            console.error("Erro Apontamento:", err);
            res.status(500).json({ message: "Erro interno do servidor", error: err.message })
        }
    }

    async atualizarApontamento(req: Request, res: Response) {
        try{
            const { id } = req.params
            const apontamento = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({ message: "Formato de ID inválido" })
            }
            
            // --- CONVERSÃO DE DATA ---
            if (apontamento.data_apontamento && typeof apontamento.data_apontamento === 'string') {
                apontamento.data_apontamento = new Date(apontamento.data_apontamento);
            }
            if (apontamento.inicio_trabalho && typeof apontamento.inicio_trabalho === 'string') {
        apontamento.inicio_trabalho = new Date(apontamento.inicio_trabalho);
    }
    if (apontamento.fim_trabalho && typeof apontamento.fim_trabalho === 'string') {
        apontamento.fim_trabalho = new Date(apontamento.fim_trabalho);
    }

            const apontamentoAtualizado = await apontamentoService.atualizarApontamento(idConvertido, apontamento)

            if(!apontamentoAtualizado){
                return res.status(404).json({ message: "Não foi possível atualizar o apontamento" })
            }

            return res.status(200).json({ message: "Apontamento atualizado" })
        }catch(err: any){
            console.error("ERRO AO ATUALIZAR APONTAMENTO:", err);
            return res.status(500).json({ 
                message: "Erro interno do servidor",
                error: err.message 
            })
        }
    }

    async deletarApontamento(req: Request, res: Response) {
        try{
            const { id } = req.params
            const idConvertido = Number(id)
            
            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Não foi possível deletar o apontamento"
                })
            }

            const apontamentoDeletado = await apontamentoService.deletarApontamento(idConvertido)

            return res.status(200).json({
                message: "apontamento deletado com sucesso",
                apontamentos: apontamentoDeletado
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
