import { prisma } from "../config/prisma";
import { Prisma, Cliente } from "@prisma/client";

export class ClienteService{

    async pegarTodosClientes(): Promise<Cliente[]>{
        return await prisma.cliente.findMany();
    };

    async pegarClientePorId(id: number): Promise<Cliente | null>{
        return await prisma.cliente.findUnique({
            where: {id}
        });
    };

    async adicionarCliente(ClienteData: Prisma.ClienteCreateInput): Promise<Cliente>{
        return await prisma.cliente.create({
            data: ClienteData
        });
    };

    async atualizarCliente(id: number, ClienteData: Prisma.ClienteUpdateInput): Promise<Cliente>{
        return await prisma.cliente.update({
            where: {id},
            data: ClienteData
        });
    };

    async deletarCliente(id: number): Promise<Cliente>{
        return await prisma.cliente.delete({
            where: {id}
        });
    };
};