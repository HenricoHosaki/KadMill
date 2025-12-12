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
            const criarApontamento = await apontamentoService.criarApontamento(apontamento)

            if(!criarApontamento){
                return res.status(400).json({
                    message: "Informações inválidas"
                })
            }

            return res.status(201).json({
                message: "apontamento registrado com sucesso"
            })
        }catch(err){
            res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async atualizarApontamento(req: Request, res: Response) {
        try{
            const { id } = req.params
            const apontamento = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            const atualizarApontamento = await apontamentoService.atualizarApontamento(idConvertido, apontamento)

            if(!atualizarApontamento){
                return res.status(404).json({
                    message: "Não foi possível atualizar o apontamento"
                })
            }

            return res.status(200).json({
                message: "apontamento atualizado"
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
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

            const deletarApontamento = await apontamentoService.deletarApontamento(idConvertido)

            return res.status(200).json({
                message: "apontamento deletado com sucesso",
                apontamentos: deletarApontamento
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
