import { prisma } from "../config/prisma";
import { Prisma, OrdemServico } from "@prisma/client";

export class OrdemServicoService{

    async pegarTodosOrdemServicos(): Promise<OrdemServico[]>{
        try{
        return await prisma.ordemServico.findMany();
        }catch(err){
            throw new Error('Não foi encontrada nenhuma Ordem de Serviço');
        };
    };

    async pegarOrdemServicoPorId(id: number): Promise<OrdemServico | null>{
        try{
        return await prisma.ordemServico.findUnique({
            where: {id}
        });
        }catch(err){
            throw new Error('ID de Ordem de Serviço não encontrado');
        };
    };

    async adicionarOrdemServico(OrdemServicoData: Prisma.OrdemServicoCreateInput): Promise<OrdemServico>{
        try{
        return await prisma.ordemServico.create({
            data: OrdemServicoData
        });
        }catch(err){
            throw new Error('Não foi possível criar a Ordem de Serviço');
        };
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