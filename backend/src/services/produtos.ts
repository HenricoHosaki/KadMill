import { prisma } from "../config/prisma";
import { Prisma, Produto } from "@prisma/client";
import { AppError } from "../errors/appError";

export class ProdutoService{
    async pegarTodosProdutos(): Promise<Produto[]>{
        const todosProdutos = await prisma.produto.findMany();
        
        if(todosProdutos.length === 0){
            throw new AppError("Nenhum produto encontrado", 404)
        };
        return todosProdutos
    };

    async pegarProdutoPorId(id: number): Promise<Produto | null>{
        const idProdutoPego = await prisma.produto.findUnique({
            where: {id}
        });

        if(!idProdutoPego){
            throw new AppError("Id de produto não encontrado", 404)
        };
        return idProdutoPego
    };

    async adicionarProduto(ProdutoData: Prisma.ProdutoCreateInput): Promise<Produto>{
        const produtoCriado = await prisma.produto.create({
            data: ProdutoData
        });
        
        if(!produtoCriado){
            throw new AppError("Não foi possível registrar o Produto")
        };
        return produtoCriado
    };

    async atualizarProduto(id: number, ProdutoData: Prisma.ProdutoUpdateInput): Promise<Produto>{
        const produtoExiste = await prisma.produto.findUnique({
            where: { id }
        })

        if(!produtoExiste){
            throw new AppError("Id de produto não encontrado", 404)
        };
        
        const atualizaProduto = await prisma.produto.update({
            where: {id},
            data: ProdutoData
        });
        return atualizaProduto
    };

    async deletarProduto(id: number): Promise<Produto>{
        const produtoExiste = await prisma.produto.findUnique({
            where: { id }
        })

        if(!produtoExiste){
            throw new AppError("Id de produto não encontrado", 404)
        };
        
        const deletaProduto = await prisma.produto.delete({
            where: {id}
        });
        return deletaProduto
    };
};