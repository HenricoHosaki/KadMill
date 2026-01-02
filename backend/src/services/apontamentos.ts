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

    async criarApontamento(apontamentoData: Prisma.ApontamentoCreateInput): Promise<Apontamento>{
            const apontamentoCriado = await prisma.apontamento.create({
            data: apontamentoData
        });

        if(!apontamentoCriado){
            throw new AppError("Não foi possível criar o apontamento")
        }
        return apontamentoCriado
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