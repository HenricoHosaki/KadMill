import { RelatorioService } from './../services/relatorios';
import { Request, Response } from 'express';
const relatorioService = new RelatorioService();

/**
 * Controller responsável pela geração de relatórios do sistema.
 * Gerencia as requisições para listagem de usuários, apontamentos e ordens de serviço.
 */
export class RelatorioController {

    async pegarTodosUsuarios(req: Request, res: Response) {
            const usuarios = await relatorioService.pegarTodosUsuarios();
 
            return res.status(200).json(usuarios);
    }
    
    async pegarTodosApontamentos(req: Request, res: Response) {
            
            const apontamentos = await relatorioService.pegarTodosApontamentos();
 
            return res.status(200).json(apontamentos);
    }

    async pegarTodasOrdensServicos(req: Request, res: Response) {

            const ordemServicos = await relatorioService.pegarTodasOrdensServicos();
 
            return res.status(200).json(ordemServicos);
        
    }
}
