import { ApontamentoService } from './../services/apontamentos';
import { Request, Response } from 'express';
const apontamentoService = new ApontamentoService();

/**
 * Controller responsável pelo controle de Apontamentos
 * Gerencia as requisições para criação, listagem, edição e exclusão de Apontamentos
 */
export class ApontamentoController {

    async pegarTodosApontamentos(req: Request, res: Response) {
            const apontamentos = await apontamentoService.pegarTodosApontamentos();
 
            return res.status(200).json(apontamentos);
    }

    async pegarApontamentoPorId(req: Request, res: Response) {
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const apontamento = await apontamentoService.pegarApontamentoPorId(idConvertido);

            return res.status(200).json(apontamento)
    }

    async criarApontamento(req: Request, res: Response) {
            const apontamento = req.body

            // --- CORREÇÃO DE DATA ---
            if(apontamento.data_apontamento && typeof apontamento.data_apontamento === 'string'){
                apontamento.data_apontamento = new Date(apontamento.data_apontamento);
            }
            if (apontamento.inicio_trabalho) apontamento.inicio_trabalho = new Date(apontamento.inicio_trabalho);
            if (apontamento.fim_trabalho) apontamento.fim_trabalho = new Date(apontamento.fim_trabalho);
            // ------------------------

            await apontamentoService.criarApontamento(apontamento)

            return res.status(201).json({ message: "Apontamento registrado com sucesso" })
    }

    async atualizarApontamento(req: Request, res: Response) {
            const { id } = req.params
            const apontamento = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({ message: "Formato de ID inválido" })
            }
            
            // -- CONVERSÃO DE DATA -- //
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

            return res.status(200).json({ message: "Apontamento atualizado" })
    }

    async deletarApontamento(req: Request, res: Response) {
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
    }
}
