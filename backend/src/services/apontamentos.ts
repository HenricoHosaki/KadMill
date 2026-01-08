import { prisma } from "../config/prisma";
import { Apontamento, Prisma } from "@prisma/client";
import { AppError } from "../errors/appError";

export class ApontamentoService{

    async pegarTodosApontamentos(): Promise<Apontamento[]>{
            const todosApontamentos = await prisma.apontamento.findMany();

            if(todosApontamentos.length === 0){
                throw new AppError("Liste de apontamentos vazia", 404)
            }
            return todosApontamentos
    };

    async pegarApontamentoPorId(id: number): Promise<Apontamento | null>{
            const idApontamentoPego = await prisma.apontamento.findUnique({
            where: {id}
        });

        if(!idApontamentoPego){
            throw new AppError("Id de apontamento não encontrado", 404)
        }
        return idApontamentoPego
    };

    async criarApontamento(apontamentoData: any): Promise<Apontamento> {
    const osExiste = await prisma.ordemServico.findUnique({
        where: { id: apontamentoData.ordemServicoId }
    });
    if (!osExiste) throw new AppError("Ordem de Serviço não encontrada", 404);

    const usuarioExiste = await prisma.usuario.findUnique({
        where: { id: apontamentoData.usuarioId }
    });
    if (!usuarioExiste) throw new AppError("Operador não encontrado", 404);

    if (apontamentoData.materiaPrimaId) {
        const mpExiste = await prisma.materiaPrima.findUnique({
            where: { id: apontamentoData.materiaPrimaId }
        });
        if (!mpExiste) throw new AppError("Matéria Prima não encontrada", 404);
    }

    if (apontamentoData.ferramentaId) {
        const ferramentaExiste = await prisma.ferramenta.findUnique({
            where: { id: apontamentoData.ferramentaId }
        });
        if (!ferramentaExiste) throw new AppError("Ferramenta não encontrada", 404);
    }

    const apontamentoCriado = await prisma.apontamento.create({
        data: apontamentoData
    });

    return apontamentoCriado;
};

    async atualizarApontamento(id: number, apontamentoData: Prisma.ApontamentoUpdateInput): Promise<Apontamento> {
        
        const apontamentoExiste = await prisma.apontamento.findUnique({
            where: { id }
        })

        if(!apontamentoExiste){
            throw new AppError("Id de apontamento não encontrado", 404)
        }
        
        const atualizaApontamento = await prisma.apontamento.update({
                where: { id },
                data: apontamentoData
        });
        return atualizaApontamento
    };
        
    async deletarApontamento(id: number): Promise<Apontamento> {
            const apontamentoExiste = await prisma.apontamento.findUnique({
                where: { id }
            })
            
            if(!apontamentoExiste){
                throw new AppError("Id de apontamento não encontrado", 404)
            }

            const deletaApontamento = await prisma.apontamento.delete({
                where: { id }
        });
            return deletaApontamento
    };
};