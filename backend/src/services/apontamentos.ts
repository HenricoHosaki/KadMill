import { prisma } from "../config/prisma";
import { Apontamento, Prisma } from "@prisma/client";

export class ApontamentoService{

    async pegarTodosApontamentos(): Promise<Apontamento[]>{
            return await prisma.apontamento.findMany();
    };

    async pegarApontamentoPorId(id: number): Promise<Apontamento | null>{
            return await prisma.apontamento.findUnique({
            where: {id}
        });
    };

    async criarApontamento(apontamentoData: Prisma.ApontamentoCreateInput): Promise<Apontamento>{
            return await prisma.apontamento.create({
            data: apontamentoData
        });
    };

    async atualizarApontamento(id: number, apontamentoData: Prisma.ApontamentoUpdateInput): Promise<Apontamento> {
            return await prisma.apontamento.update({
                where: { id },
                data: apontamentoData
        });
    ;}
        
    async deletarApontamento(id: number): Promise<Apontamento> {
            return await prisma.apontamento.delete({
                where: { id }
        });
    };
};