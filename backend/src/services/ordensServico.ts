import { prisma } from "../config/prisma";
import { Prisma, OrdemServico } from "@prisma/client";

export class OrdemServicoService{

    async pegarTodasOrdensServicos(): Promise<OrdemServico[]>{
        return await prisma.ordemServico.findMany();
    };

    async pegarOrdemServicoPorId(id: number): Promise<OrdemServico | null>{
        return await prisma.ordemServico.findUnique({
            where: {id}
        });
    };

    async adicionarOrdemServico(OrdemServicoData: Prisma.OrdemServicoCreateInput): Promise<OrdemServico>{
        return await prisma.ordemServico.create({
            data: OrdemServicoData
        });
    };

    async atualizarOrdemServico(id: number, OrdemServicoData: Prisma.OrdemServicoUpdateInput): Promise<OrdemServico>{
        return await prisma.ordemServico.update({
            where: {id},
            data: OrdemServicoData
        });
    };

    async deletarOrdemServico(id: number): Promise<OrdemServico>{
        return await prisma.ordemServico.delete({
            where: {id}
        });
    }
}