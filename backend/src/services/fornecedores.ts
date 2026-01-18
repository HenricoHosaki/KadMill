import { prisma } from "../config/prisma";
import { Prisma, Fornecedor } from "@prisma/client";
import { AppError } from "../errors/appError";

export class FornecedorService{

    async pegarTodosFornecedores(): Promise<Fornecedor[]>{
        const todosFornecedores = await prisma.fornecedor.findMany();
        
        return todosFornecedores
    };

    async pegarFornecedorPorId(id: number): Promise<Fornecedor | null>{
        const idFornecedorPego = await prisma.fornecedor.findUnique({
            where: {id}
        });
        if(!idFornecedorPego){
            throw new AppError("Id de fornecedor não encontrado", 404)
        };
        return idFornecedorPego
    };

    async adicionarFornecedor(FornecedorData: Prisma.FornecedorCreateInput): Promise<Fornecedor>{
        const fornecedorCriado = await prisma.fornecedor.create({
            data: FornecedorData
        });
        if(!fornecedorCriado){
            throw new AppError("Não foi possível criar o fornecedor")
        };
        return fornecedorCriado
    };

    async atualizarFornecedor(id: number, FornecedorData: Prisma.FornecedorUpdateInput): Promise<Fornecedor>{
        const fornecedorExiste = await prisma.fornecedor.findUnique({
            where: { id }
        });
        
        if(!fornecedorExiste){
            throw new AppError("Id de fornecedor não existe", 404)
        }
        
        const atualizaFornecedor = await prisma.fornecedor.update({
            where: {id},
            data: FornecedorData
        });
        return atualizaFornecedor
    };

    async deletarFornecedor(id: number): Promise<Fornecedor>{
        const fornecedorExiste = await prisma.fornecedor.findUnique({
            where: { id }
        });
        
        if(!fornecedorExiste){
            throw new AppError("Id de fornecedor não existe", 404)
        }
        
        const deletaFornecedor = await prisma.fornecedor.delete({
            where: {id}
        });
        return deletaFornecedor
    };
};