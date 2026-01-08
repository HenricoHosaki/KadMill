import { prisma } from "../config/prisma";
import { Prisma, OrdemServico } from "@prisma/client";
import { AppError } from "../errors/appError";

export class OrdemServicoService{

    async pegarTodasOrdensServicos(): Promise<OrdemServico[]> {
    const todasOrdensServicos = await prisma.ordemServico.findMany({
        include: {
            cliente: true,
        },
        orderBy: {
            id: 'desc'
        }
    });
    
    if(todasOrdensServicos.length === 0){
        throw new AppError("Nenhuma ordem de serviço encontrada", 404)
    };
    return todasOrdensServicos;
};

    async pegarOrdemServicoPorId(id: number): Promise<OrdemServico | null>{
        const idOrdemServicoPego = await prisma.ordemServico.findUnique({
            where: {id}
        });

        if(!idOrdemServicoPego){
            throw new AppError("Id de ordem de serviço não encontrado", 404)
        };
        return idOrdemServicoPego
    };

    async adicionarOrdemServico(OrdemServicoData: Prisma.OrdemServicoCreateInput): Promise<OrdemServico>{
        const ordemServicoCriada = await prisma.ordemServico.create({
            data: OrdemServicoData
        });

        if(!ordemServicoCriada){
            throw new Error("Não foi possível criar a ordem de serviço")
        };
        return ordemServicoCriada
    };

    async atualizarOrdemServico(id: number, OrdemServicoData: Prisma.OrdemServicoUpdateInput): Promise<OrdemServico>{
        const OrdemServicoExiste = await prisma.ordemServico.findUnique({
            where: { id }
        });

        if(!OrdemServicoExiste){
            throw new AppError("Id de ordem de serviço não encontrada", 404)
        };

        const atualizaOrdemServico = await prisma.ordemServico.update({
            where: {id},
            data: OrdemServicoData
        });
        return atualizaOrdemServico
    };

    async deletarOrdemServico(id: number): Promise<OrdemServico>{
        const OrdemServicoExiste = await prisma.ordemServico.findUnique({
            where: { id }
        });

        if(!OrdemServicoExiste){
            throw new AppError("Id de ordem de serviço não encontrada", 404)
        };
        
        const deletaOrdemServico = await prisma.ordemServico.delete({
            where: {id}
        });
        return deletaOrdemServico
    }
}