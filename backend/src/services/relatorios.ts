import { prisma } from "../config/prisma";
import { Prisma, Apontamento, Usuario, OrdemServico } from "@prisma/client";

export class RelatorioService{

    async pegarTodosApontamentos(): Promise<Apontamento[]>{
        return await prisma.apontamento.findMany();
    }

    async pegarTodosUsuarios(): Promise<Usuario[]>{
        return await prisma.usuario.findMany();
    }

    async pegarTodasOrdensServicos(): Promise<OrdemServico[]>{
        return await prisma.ordemServico.findMany();
    }
}