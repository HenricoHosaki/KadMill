import { MateriaPrimaService } from './../services/materiasPrimas';
import { Request, Response } from 'express';
const materiaPrimaService = new MateriaPrimaService();

/**
 * Controller da MatériaPrima
 */
export class MateriaPrimaController {
    async pegarTodosMateriaPrimas(req: Request, res: Response) {
        try {
            const materiaPrimas = await materiaPrimaService.pegarTodosMateriaPrimas();
 
            return res.status(200).json(materiaPrimas);
        } catch (err) {
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    async pegarMateriaPrimaPorId(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }

            const materiaPrima = await materiaPrimaService.pegarMateriaPrimaPorId(idConvertido);

            if(!materiaPrima){
                return res.status(404).json({
                    messsage: "Matéria prima não encontrada"
                })
            }

            return res.status(200).json(materiaPrima)
        }catch(err){
            return res.status(500).json({
                message: "Erro ao encontrar ID da matéria prima"
            })
        }
    }

    async criarMateriaPrima(req: Request, res: Response) {
        try{
            const materiaPrima = req.body
            const materiaPrimaCriada = await materiaPrimaService.adicionarMateriaPrima(materiaPrima)

            if(!materiaPrimaCriada){
                return res.status(400).json({
                    message: "Informações inválidas"
                })
            }

            return res.status(201).json({
                message: "Matéria prima registrada com sucesso"
            })
        }catch(err){
            res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async atualizarMateriaPrima(req: Request, res: Response) {
        try{
            const { id } = req.params
            const materiaPrima = req.body
            const idConvertido = Number(id);

            if(isNaN(idConvertido)){
                return res.status(400).json({
                    message: "Formato de ID inválido"
                })
            }
            
            const materiaPrimaAtualizada = await materiaPrimaService.atualizarMateriaPrima(idConvertido, materiaPrima)

            if(!materiaPrimaAtualizada){
                return res.status(404).json({
                    message: "Não foi possível atualizar a matéria prima"
                })
            }

            return res.status(200).json({
                message: "Matéria prima atualizada"
            })
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }

    async deletarMateriaPrima(req: Request, res: Response) {
        try{
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
        }catch(err){
            return res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
