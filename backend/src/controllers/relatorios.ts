import { RelatorioService } from './../services/relatorios';
import { Request, Response } from 'express';

const relatorioService = new RelatorioService();

export class RelatorioController {

    async pegarTodosUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await relatorioService.pegarTodosUsuarios();
 
            return res.status(200).json(usuarios);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }
    async pegarTodosApontamentos(req: Request, res: Response) {
        try {
            const apontamentos = await relatorioService.pegarTodosApontamentos();
 
            return res.status(200).json(apontamentos);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }
    async pegarTodasOrdensServicos(req: Request, res: Response) {
        try {
            const ordemServicos = await relatorioService.pegarTodasOrdensServicos();
 
            return res.status(200).json(ordemServicos);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }
}
