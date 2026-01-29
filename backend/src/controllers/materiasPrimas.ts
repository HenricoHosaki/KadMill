import { MateriaPrimaService } from './../services/materiasPrimas';
import { Request, Response } from 'express';
const materiaPrimaService = new MateriaPrimaService();

/**
 * Controller responsável pelo controle de Materias Primas do sistema
 * Gerencia as requisições para criação, listagem, edição e exclusão de Materias Primas
 */
export class MateriaPrimaController {
    async pegarTodosMateriaPrimas(req: Request, res: Response) {
    
            const materiaPrimas = await materiaPrimaService.pegarTodosMateriaPrimas();
 
            return res.status(200).json(materiaPrimas);
    }

    async pegarMateriaPrimaPorId(req: Request, res: Response) {
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const materiaPrima = await materiaPrimaService.pegarMateriaPrimaPorId(idConvertido);

            return res.status(200).json(materiaPrima)
    }

    async criarMateriaPrima(req: Request, res: Response) {
            const materiaPrima = req.body
            await materiaPrimaService.adicionarMateriaPrima(materiaPrima)

            return res.status(201).json({
                message: "Matéria prima registrada com sucesso"
            })
    }

    async atualizarMateriaPrima(req: Request, res: Response) {
            const { id } = req.params
            const materiaPrima = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            await materiaPrimaService.atualizarMateriaPrima(idConvertido, materiaPrima)

            return res.status(200).json({
                message: "Matéria prima atualizada"
            })
    }

    async deletarMateriaPrima(req: Request, res: Response) {
            const { id } = req.params
            const idConvertido = Number(id)
            
            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Não foi possível deletar a matéria prima"
                })
            }

            const materiaPrimaDeletada = await materiaPrimaService.deletarMateriaPrima(idConvertido)

            return res.status(200).json({
                message: "Usuário deletado com sucesso",
                materiaPrima: materiaPrimaDeletada
            })
    }
}
