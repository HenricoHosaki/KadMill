import { prisma } from "../config/prisma";
import { Prisma, Produto } from "@prisma/client";

export class ProdutoService{
    async pegarTodosProdutos(): Promise<Produto[]>{
            return await prisma.produto.findMany();
    };

    async pegarProdutoPorId(id: number): Promise<Produto | null>{
            return await prisma.produto.findUnique({
            where: {id}
        });
    };

    async adicionarProduto(ProdutoData: Prisma.ProdutoCreateInput): Promise<Produto>{
            return await prisma.produto.create({
            data: ProdutoData
        });
    };

    async atualizarProduto(id: number, ProdutoData: Prisma.ProdutoUpdateInput): Promise<Produto>{
        return await prisma.produto.update({
            where: {id},
            data: ProdutoData
        });
    };

    async deletarProduto(id: number): Promise<Produto>{
        return await prisma.produto.delete({
            where: {id}
        });
    };
};