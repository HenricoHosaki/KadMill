import { Request, Response } from 'express';
import { FerramentaService } from '../services/ferramentas';
const ferramentaService = new FerramentaService();

/**
 * Controller responsável pelo controle de Ferramentas do sistema
 * Gerencia as requisições para criação, listagem, edição e exclusão de Ferramentas
 */
export class FerramentaController {

    async pegarTodas(req: Request, res: Response) {
            const ferramentas = await ferramentaService.pegarTodasFerramentas();

            return res.status(200).json(ferramentas);
    }

    async criar(req: Request, res: Response) {
            const dados = req.body;

            if(dados.ultima_manutencao && typeof dados.ultima_manutencao === 'string'){
                dados.ultima_manutencao = new Date(dados.ultima_manutencao);
            }

            const novaFerramenta = await ferramentaService.criarFerramenta(dados);
            return res.status(201).json(novaFerramenta);
    }

    async atualizar(req: Request, res: Response) {
            const { id } = req.params;
            const dados = req.body;
            const idNum = Number(id);

            if(isNaN(idNum)) return res.status(400).json({ message: "ID inválido" });

            if(dados.ultima_manutencao && typeof dados.ultima_manutencao === 'string'){
                dados.ultima_manutencao = new Date(dados.ultima_manutencao);
            }

            const atualizada = await ferramentaService.atualizarFerramenta(idNum, dados);
            return res.status(200).json(atualizada);  
    }

    async deletar(req: Request, res: Response) {
            const { id } = req.params;
            const idNum = Number(id);
            if(isNaN(idNum)) return res.status(400).json({ message: "ID inválido" });

            await ferramentaService.deletarFerramenta(idNum);
            return res.status(200).json({ message: "Ferramenta deletada" });
    }
}