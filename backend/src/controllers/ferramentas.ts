import { Request, Response } from 'express';
import { FerramentaService } from '../services/ferramentas';
const ferramentaService = new FerramentaService();

/**
 * Controller responsável pelo controle de Ferramentas do sistema
 * Gerencia as requisições para criação, listagem, edição e exclusão de Ferramentas
 */
export class FerramentaController {

    async pegarTodas(req: Request, res: Response) {
        try {
            const ferramentas = await ferramentaService.pegarTodasFerramentas();
            return res.status(200).json(ferramentas);
        } catch (err) {
            return res.status(500).json({ message: "Erro interno" });
        }
    }

    async criar(req: Request, res: Response) {
        try {
            const dados = req.body;
            
            // Tratamento de data se vier do front
            if(dados.ultima_manutencao && typeof dados.ultima_manutencao === 'string'){
                dados.ultima_manutencao = new Date(dados.ultima_manutencao);
            }

            const novaFerramenta = await ferramentaService.criarFerramenta(dados);
            return res.status(201).json(novaFerramenta);
        } catch (err: any) {
            console.error("Erro Ferramenta:", err);
            return res.status(500).json({ message: "Erro ao criar ferramenta", error: err.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const dados = req.body;
            const idNum = Number(id);

            if(isNaN(idNum)) return res.status(400).json({ message: "ID inválido" });

            if(dados.ultima_manutencao && typeof dados.ultima_manutencao === 'string'){
                dados.ultima_manutencao = new Date(dados.ultima_manutencao);
            }

            const atualizada = await ferramentaService.atualizarFerramenta(idNum, dados);
            return res.status(200).json(atualizada);
        } catch (err) {
            return res.status(500).json({ message: "Erro ao atualizar" });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const idNum = Number(id);
            if(isNaN(idNum)) return res.status(400).json({ message: "ID inválido" });

            await ferramentaService.deletarFerramenta(idNum);
            return res.status(200).json({ message: "Ferramenta deletada" });
        } catch (err) {
            return res.status(500).json({ message: "Erro ao deletar" });
        }
    }
}