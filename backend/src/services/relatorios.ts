import { prisma } from "../config/prisma";
import { Prisma, Apontamento, Usuario, OrdemServico } from "@prisma/client";
import { AppError } from "../errors/appError";
import { todo } from "node:test";

export class RelatorioService{

    async pegarTodosApontamentos(): Promise<Apontamento[]>{
        const todosApontamentos = await prisma.apontamento.findMany();
        
        return todosApontamentos
    };

    async pegarTodosUsuarios(): Promise<Usuario[]>{
        const todosUsuarios = await prisma.usuario.findMany();

        if(todosUsuarios.length === 0){
            throw new AppError("Nenhum usuário encontrado", 404)
        };
        return todosUsuarios
    };

    async pegarTodasOrdensServicos(): Promise<OrdemServico[]>{
        const todasOrdensServicos = await prisma.ordemServico.findMany();

        if(todasOrdensServicos.length === 0){
            throw new AppError("Nenhuma ordem de serviço encontrada", 404)
        };
        return todasOrdensServicos
    };
}