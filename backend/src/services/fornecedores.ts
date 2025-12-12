import { prisma } from "../config/prisma";
import { Prisma, Fornecedor } from "@prisma/client";

export class FornecedorService{

    async pegarTodosFornecedores(): Promise<Fornecedor[]>{
            return await prisma.fornecedor.findMany();
    };

    async pegarFornecedorPorId(id: number): Promise<Fornecedor | null>{
            return await prisma.fornecedor.findUnique({
            where: {id}
        });
    };

    async adicionarFornecedor(FornecedorData: Prisma.FornecedorCreateInput): Promise<Fornecedor>{
            return await prisma.fornecedor.create({
            data: FornecedorData
        });
    };

    async atualizarFornecedor(id: number, FornecedorData: Prisma.FornecedorUpdateInput): Promise<Fornecedor>{
            return await prisma.fornecedor.update({
            where: {id},
            data: FornecedorData
        });
    };

    async deletarFornecedor(id: number): Promise<Fornecedor>{
            return await prisma.fornecedor.delete({
            where: {id}
        });
    };
};