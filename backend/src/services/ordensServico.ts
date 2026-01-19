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

    async adicionarOrdemServico(OrdemServicoData: any): Promise<OrdemServico>{
        
        // Usamos uma transação para garantir que tudo acontece de uma vez
        return await prisma.$transaction(async (tx) => {
            // 1. Cria a OS com um número temporário único (para não dar erro de duplicidade)
            const tempNumero = `TEMP-${Date.now()}`;
            
            const osCriada = await tx.ordemServico.create({
                data: {
                    ...OrdemServicoData,
                    numero_os: tempNumero // Placeholder
                }
            });

            // 2. Agora que temos o ID (osCriada.id), geramos o formato bonito
            const ano = new Date().getFullYear();
            // Exemplo: OS-2026-001 (o padStart completa com zeros à esquerda)
            const numeroFinal = `OS-${ano}-${osCriada.id.toString().padStart(3, '0')}`;

            // 3. Atualizamos o registro com o número correto
            return await tx.ordemServico.update({
                where: { id: osCriada.id },
                data: { numero_os: numeroFinal }
            });
        });
    };

    async atualizarOrdemServico(id: number, OrdemServicoData: any): Promise<OrdemServico>{
        
        const existeOrdemServico = await prisma.ordemServico.findUnique({
             where: { id }
        })

        if(!existeOrdemServico){
             throw new AppError("Id de ordem de serviço não encontrada", 404)
        };

        const { 
            id: _id,
            cliente,
            apontamentosOrdemServico,
            ...dadosLimpos
        } = OrdemServicoData;

        const atualizaOrdemServico = await prisma.ordemServico.update({
            where: {
                id: id
            },
            data: dadosLimpos
        })

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